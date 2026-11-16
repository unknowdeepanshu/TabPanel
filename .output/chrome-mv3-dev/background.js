var background = (function() {
	//#endregion
	//#region node_modules/wxt/dist/browser.mjs
	/**
	* Contains the `browser` export which you should use to access the extension
	* APIs in your project:
	*
	* ```ts
	* import { browser } from 'wxt/browser';
	*
	* browser.runtime.onInstalled.addListener(() => {
	*   // ...
	* });
	* ```
	*
	* @module wxt/browser
	*/
	var browser = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;
	//#endregion
	//#region node_modules/wxt/dist/utils/define-background.mjs
	function defineBackground(arg) {
		if (arg == null || typeof arg === "function") return { main: arg };
		return arg;
	}
	//#endregion
	//#region src/entrypoints/background.ts
	var background_default = defineBackground(() => {
		let tabPlanWindowId = null;
		async function openTabPlan() {
			if (tabPlanWindowId !== null) try {
				await browser.windows.get(tabPlanWindowId);
				await browser.windows.update(tabPlanWindowId, { focused: true });
				return;
			} catch {
				tabPlanWindowId = null;
			}
			tabPlanWindowId = (await browser.windows.create({
				url: chrome.runtime.getURL("popup.html"),
				type: "popup",
				width: 1100,
				height: 750,
				focused: true
			}))?.id ?? null;
		}
		browser.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
			if (message.type !== "GET_TAB_DATA") return false;
			const windows = await browser.windows.getAll();
			sendResponse({
				success: true,
				data: await Promise.all(windows.map(async (window) => {
					if (window.id === void 0) throw new Error("Browser returned a window without an id.");
					const tabs = await browser.tabs.query({ windowId: window.id });
					const groups = await browser.tabGroups.query({ windowId: window.id });
					const groupsWithTabs = await Promise.all(groups.map(async (group) => ({
						...group,
						tabs: await browser.tabs.query({ groupId: group.id })
					})));
					return {
						windowId: window.id,
						tabs,
						groups: groupsWithTabs
					};
				}))
			});
			return true;
		});
		browser.action.onClicked.addListener(() => {
			openTabPlan();
		});
		browser.commands.onCommand.addListener((command) => {
			if (command === "toggle-tabplan") openTabPlan();
		});
		browser.windows.onRemoved.addListener((windowId) => {
			if (windowId === tabPlanWindowId) tabPlanWindowId = null;
		});
	});
	//#endregion
	//#region node_modules/@webext-core/match-patterns/dist/index.mjs
	/**
	* Class for parsing and performing operations on match patterns.
	*
	* @example
	*   const pattern = new MatchPattern('*://google.com/*');
	*
	*   pattern.includes('https://google.com'); // true
	*   pattern.includes('http://youtube.com/watch?v=123'); // false
	*/
	var MatchPattern = class MatchPattern {
		static {
			this.PROTOCOLS = [
				"http",
				"https",
				"file",
				"ftp",
				"urn",
				"ws",
				"wss"
			];
		}
		/**
		* Parse a match pattern string. If it is invalid, the constructor will throw an
		* `InvalidMatchPattern` error.
		*
		* @param matchPattern The match pattern to parse.
		*/
		constructor(matchPattern) {
			if (matchPattern === "<all_urls>") {
				this.isAllUrls = true;
				this.protocolMatches = [...MatchPattern.PROTOCOLS];
				this.hostnameMatch = "*";
				this.pathnameMatch = "*";
			} else {
				const groups = /(.*):\/\/(.*?)(\/.*)/.exec(matchPattern);
				if (groups == null) throw new InvalidMatchPattern(matchPattern, "Incorrect format");
				const [_, protocol, hostname, pathname] = groups;
				validateProtocol(matchPattern, protocol);
				validateHostname(matchPattern, hostname);
				this.protocolMatches = protocol === "*" ? ["http", "https"] : [protocol];
				this.hostnameMatch = hostname;
				this.pathnameMatch = pathname;
			}
		}
		/** Check if a URL is included in a pattern. */
		includes(url) {
			const u = typeof url === "string" ? new URL(url) : url instanceof Location ? new URL(url.href) : url;
			if (this.isAllUrls) return !this.isUnknownProtocol(u);
			return !!this.protocolMatches.find((protocol) => {
				if (protocol === "http") return this.isHttpMatch(u);
				if (protocol === "https") return this.isHttpsMatch(u);
				if (protocol === "file") return this.isFileMatch(u);
				if (protocol === "ftp") return this.isFtpMatch(u);
				if (protocol === "urn") return this.isUrnMatch(u);
			});
		}
		isHttpMatch(url) {
			return url.protocol === "http:" && this.isHostPathMatch(url);
		}
		isHttpsMatch(url) {
			return url.protocol === "https:" && this.isHostPathMatch(url);
		}
		isHostPathMatch(url) {
			if (!this.hostnameMatch || !this.pathnameMatch) return false;
			const hostnameMatchRegexs = [this.convertPatternToRegex(this.hostnameMatch), this.convertPatternToRegex(this.hostnameMatch.replace(/^\*\./, ""))];
			const pathnameMatchRegex = this.convertPatternToRegex(this.pathnameMatch);
			return !!hostnameMatchRegexs.find((regex) => regex.test(url.hostname)) && pathnameMatchRegex.test(url.pathname);
		}
		isUnknownProtocol(url) {
			return !this.protocolMatches.includes(url.protocol.slice(0, -1));
		}
		isPathMatch(url) {
			if (!this.pathnameMatch) return false;
			return this.convertPatternToRegex(this.pathnameMatch).test(url.pathname);
		}
		isFileMatch(url) {
			return url.protocol === "file:" && this.isPathMatch(url);
		}
		isFtpMatch(_url) {
			throw Error("Not implemented: ftp:// pattern matching. Open a PR to add support");
		}
		isUrnMatch(_url) {
			throw Error("Not implemented: urn:// pattern matching. Open a PR to add support");
		}
		convertPatternToRegex(pattern) {
			const starsReplaced = this.escapeForRegex(pattern).replace(/\\\*/g, ".*");
			return RegExp(`^${starsReplaced}$`);
		}
		escapeForRegex(string) {
			return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		}
	};
	var InvalidMatchPattern = class extends Error {
		constructor(matchPattern, reason) {
			super(`Invalid match pattern "${matchPattern}": ${reason}`);
		}
	};
	function validateProtocol(matchPattern, protocol) {
		if (!MatchPattern.PROTOCOLS.includes(protocol) && protocol !== "*") throw new InvalidMatchPattern(matchPattern, `${protocol} not a valid protocol (${MatchPattern.PROTOCOLS.join(", ")})`);
	}
	function validateHostname(matchPattern, hostname) {
		if (hostname.includes(":")) throw new InvalidMatchPattern(matchPattern, `Hostname cannot include a port`);
		if (hostname.includes("*") && hostname.length > 1 && !hostname.startsWith("*.")) throw new InvalidMatchPattern(matchPattern, `If using a wildcard (*), it must go at the start of the hostname`);
	}
	//#endregion
	//#region \0virtual:wxt-background-entrypoint?B:/newProjects/tab managements/src/entrypoints/background.ts
	function print(method, ...args) {
		if (typeof args[0] === "string") method(`[wxt] ${args.shift()}`, ...args);
		else method("[wxt]", ...args);
	}
	/** Wrapper around `console` with a "[wxt]" prefix */
	var logger = {
		debug: (...args) => print(console.debug, ...args),
		log: (...args) => print(console.log, ...args),
		warn: (...args) => print(console.warn, ...args),
		error: (...args) => print(console.error, ...args)
	};
	var ws;
	/** Connect to the websocket and listen for messages. */
	function getDevServerWebSocket() {
		if (ws == null) {
			const serverUrl = "ws://localhost:3000";
			logger.debug("Connecting to dev server @", serverUrl);
			ws = new WebSocket(serverUrl, "vite-hmr");
			ws.addWxtEventListener = ws.addEventListener.bind(ws);
			ws.sendCustom = (event, payload) => ws?.send(JSON.stringify({
				type: "custom",
				event,
				payload
			}));
			ws.addEventListener("open", () => {
				logger.debug("Connected to dev server");
			});
			ws.addEventListener("close", () => {
				logger.debug("Disconnected from dev server");
			});
			ws.addEventListener("error", (event) => {
				logger.error("Failed to connect to dev server", event);
			});
			ws.addEventListener("message", (e) => {
				try {
					const message = JSON.parse(e.data);
					if (message.type === "custom") ws?.dispatchEvent(new CustomEvent(message.event, { detail: message.data }));
				} catch (err) {
					logger.error("Failed to handle message", err);
				}
			});
		}
		return ws;
	}
	/** https://developer.chrome.com/blog/longer-esw-lifetimes/ */
	function keepServiceWorkerAlive() {
		setInterval(async () => {
			await browser.runtime.getPlatformInfo();
		}, 5e3);
	}
	function reloadContentScript(payload) {
		if (browser.runtime.getManifest().manifest_version == 2) reloadContentScriptMv2(payload);
		else reloadContentScriptMv3(payload);
	}
	async function reloadContentScriptMv3({ registration, contentScript }) {
		if (registration === "runtime") await reloadRuntimeContentScriptMv3(contentScript);
		else await reloadManifestContentScriptMv3(contentScript);
	}
	/**
	* Reloads of one script run one after another. Two reloads that overlap can
	* both read an empty registration list and both register, and the second
	* registration throws "Duplicate script ID".
	*/
	var manifestReloads = /* @__PURE__ */ new Map();
	async function reloadManifestContentScriptMv3(contentScript) {
		const id = `wxt:${contentScript.js[0]}`;
		const reload = (manifestReloads.get(id) ?? Promise.resolve()).then(() => reloadManifestContentScriptNow(id, contentScript));
		manifestReloads.set(id, reload.catch(() => {}));
		return reload;
	}
	async function reloadManifestContentScriptNow(id, contentScript) {
		logger.log("Reloading content script:", contentScript);
		const registered = await browser.scripting.getRegisteredContentScripts();
		logger.debug("Existing scripts:", registered);
		const existing = registered.find((cs) => cs.id === id);
		if (existing) {
			logger.debug("Updating content script", existing);
			await browser.scripting.updateContentScripts([{
				...contentScript,
				id,
				css: contentScript.css ?? []
			}]);
		} else {
			logger.debug("Registering new content script...");
			await browser.scripting.registerContentScripts([{
				...contentScript,
				id,
				css: contentScript.css ?? []
			}]);
		}
		await reloadTabsForContentScript(contentScript);
	}
	async function reloadRuntimeContentScriptMv3(contentScript) {
		logger.log("Reloading content script:", contentScript);
		const registered = await browser.scripting.getRegisteredContentScripts();
		logger.debug("Existing scripts:", registered);
		const matches = registered.filter((cs) => {
			const hasJs = contentScript.js?.find((js) => cs.js?.includes(js));
			const hasCss = contentScript.css?.find((css) => cs.css?.includes(css));
			return hasJs || hasCss;
		});
		if (matches.length === 0) {
			logger.log("Content script is not registered yet, nothing to reload", contentScript);
			return;
		}
		await browser.scripting.updateContentScripts(matches);
		await reloadTabsForContentScript(contentScript);
	}
	async function reloadTabsForContentScript(contentScript) {
		const allTabs = await browser.tabs.query({});
		const matchPatterns = contentScript.matches.map((match) => new MatchPattern(match));
		const matchingTabs = allTabs.filter((tab) => {
			const url = tab.url;
			if (!url) return false;
			return !!matchPatterns.find((pattern) => pattern.includes(url));
		});
		await Promise.all(matchingTabs.map(async (tab) => {
			try {
				await browser.tabs.reload(tab.id);
			} catch (err) {
				logger.warn("Failed to reload tab:", err);
			}
		}));
	}
	async function reloadContentScriptMv2(_payload) {
		throw Error("TODO: reloadContentScriptMv2");
	}
	try {
		const ws = getDevServerWebSocket();
		ws.addWxtEventListener("wxt:reload-extension", () => {
			browser.runtime.reload();
		});
		ws.addWxtEventListener("wxt:reload-content-script", (event) => {
			reloadContentScript(event.detail);
		});
		ws.addEventListener("open", () => ws.sendCustom("wxt:background-initialized"));
		keepServiceWorkerAlive();
	} catch (err) {
		logger.error("Failed to setup web socket connection with dev server", err);
	}
	browser.commands.onCommand.addListener((command) => {
		if (command === "wxt:reload-extension") browser.runtime.reload();
	});
	var result;
	try {
		result = background_default.main();
		if (result instanceof Promise) console.warn("The background's main() function return a promise, but it must be synchronous");
	} catch (err) {
		logger.error("The background crashed on startup!");
		throw err;
	}
	//#endregion
	return result;
})();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm5hbWVzIjpbImJyb3dzZXIiXSwic291cmNlcyI6WyIuLi8uLi9ub2RlX21vZHVsZXMvQHd4dC1kZXYvYnJvd3Nlci9zcmMvaW5kZXgubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL3d4dC9kaXN0L2Jyb3dzZXIubWpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2RlZmluZS1iYWNrZ3JvdW5kLm1qcyIsIi4uLy4uL3NyYy9lbnRyeXBvaW50cy9iYWNrZ3JvdW5kLnRzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL0B3ZWJleHQtY29yZS9tYXRjaC1wYXR0ZXJucy9kaXN0L2luZGV4Lm1qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyAjcmVnaW9uIHNuaXBwZXRcbmV4cG9ydCBjb25zdCBicm93c2VyID0gZ2xvYmFsVGhpcy5icm93c2VyPy5ydW50aW1lPy5pZFxuICA/IGdsb2JhbFRoaXMuYnJvd3NlclxuICA6IGdsb2JhbFRoaXMuY2hyb21lO1xuLy8gI2VuZHJlZ2lvbiBzbmlwcGV0XG4iLCJpbXBvcnQgeyBicm93c2VyIGFzIGJyb3dzZXIkMSB9IGZyb20gXCJAd3h0LWRldi9icm93c2VyXCI7XG4vLyNyZWdpb24gc3JjL2Jyb3dzZXIudHNcbi8qKlxuKiBDb250YWlucyB0aGUgYGJyb3dzZXJgIGV4cG9ydCB3aGljaCB5b3Ugc2hvdWxkIHVzZSB0byBhY2Nlc3MgdGhlIGV4dGVuc2lvblxuKiBBUElzIGluIHlvdXIgcHJvamVjdDpcbipcbiogYGBgdHNcbiogaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gJ3d4dC9icm93c2VyJztcbipcbiogYnJvd3Nlci5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKCgpID0+IHtcbiogICAvLyAuLi5cbiogfSk7XG4qIGBgYFxuKlxuKiBAbW9kdWxlIHd4dC9icm93c2VyXG4qL1xuY29uc3QgYnJvd3NlciA9IGJyb3dzZXIkMTtcbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgYnJvd3NlciB9O1xuIiwiLy8jcmVnaW9uIHNyYy91dGlscy9kZWZpbmUtYmFja2dyb3VuZC50c1xuZnVuY3Rpb24gZGVmaW5lQmFja2dyb3VuZChhcmcpIHtcblx0aWYgKGFyZyA9PSBudWxsIHx8IHR5cGVvZiBhcmcgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHsgbWFpbjogYXJnIH07XG5cdHJldHVybiBhcmc7XG59XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IGRlZmluZUJhY2tncm91bmQgfTtcbiIsImltcG9ydCB7IGJyb3dzZXIgfSBmcm9tIFwid3h0L2Jyb3dzZXJcIjtcclxuaW1wb3J0IHsgZGVmaW5lQmFja2dyb3VuZCB9IGZyb20gXCJ3eHQvdXRpbHMvZGVmaW5lLWJhY2tncm91bmRcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUJhY2tncm91bmQoKCkgPT4ge1xyXG4gIGxldCB0YWJQbGFuV2luZG93SWQ6IG51bWJlciB8IG51bGwgPSBudWxsO1xyXG5cclxuICBhc3luYyBmdW5jdGlvbiBvcGVuVGFiUGxhbigpIHtcclxuICAgIGlmICh0YWJQbGFuV2luZG93SWQgIT09IG51bGwpIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCBicm93c2VyLndpbmRvd3MuZ2V0KHRhYlBsYW5XaW5kb3dJZCk7XHJcbiAgICAgICAgYXdhaXQgYnJvd3Nlci53aW5kb3dzLnVwZGF0ZSh0YWJQbGFuV2luZG93SWQsIHsgZm9jdXNlZDogdHJ1ZSB9KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgIHRhYlBsYW5XaW5kb3dJZCA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB3aW5kb3cgPSBhd2FpdCBicm93c2VyLndpbmRvd3MuY3JlYXRlKHtcclxuICAgICAgdXJsOiBjaHJvbWUucnVudGltZS5nZXRVUkwoXCJwb3B1cC5odG1sXCIpLFxyXG4gICAgICB0eXBlOiBcInBvcHVwXCIsXHJcbiAgICAgIHdpZHRoOiAxMTAwLFxyXG4gICAgICBoZWlnaHQ6IDc1MCxcclxuICAgICAgZm9jdXNlZDogdHJ1ZSxcclxuICAgIH0pO1xyXG5cclxuICAgIHRhYlBsYW5XaW5kb3dJZCA9IHdpbmRvdz8uaWQgPz8gbnVsbDtcclxuICB9XHJcblxyXG4gIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoYXN5bmMgKG1lc3NhZ2UsIF9zZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xyXG4gICAgaWYgKG1lc3NhZ2UudHlwZSAhPT0gXCJHRVRfVEFCX0RBVEFcIikge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgd2luZG93cyA9IGF3YWl0IGJyb3dzZXIud2luZG93cy5nZXRBbGwoKTtcclxuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBQcm9taXNlLmFsbChcclxuICAgICAgd2luZG93cy5tYXAoYXN5bmMgKHdpbmRvdykgPT4ge1xyXG4gICAgICAgIGlmICh3aW5kb3cuaWQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQnJvd3NlciByZXR1cm5lZCBhIHdpbmRvdyB3aXRob3V0IGFuIGlkLlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBicm93c2VyLnRhYnMucXVlcnkoeyB3aW5kb3dJZDogd2luZG93LmlkIH0pO1xyXG4gICAgICAgIGNvbnN0IGdyb3VwcyA9IGF3YWl0IGJyb3dzZXIudGFiR3JvdXBzLnF1ZXJ5KHsgd2luZG93SWQ6IHdpbmRvdy5pZCB9KTtcclxuICAgICAgICBjb25zdCBncm91cHNXaXRoVGFicyA9IGF3YWl0IFByb21pc2UuYWxsKFxyXG4gICAgICAgICAgZ3JvdXBzLm1hcChhc3luYyAoZ3JvdXApID0+ICh7XHJcbiAgICAgICAgICAgIC4uLmdyb3VwLFxyXG4gICAgICAgICAgICB0YWJzOiBhd2FpdCBicm93c2VyLnRhYnMucXVlcnkoeyBncm91cElkOiBncm91cC5pZCB9KSxcclxuICAgICAgICAgIH0pKSxcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4geyB3aW5kb3dJZDogd2luZG93LmlkLCB0YWJzLCBncm91cHM6IGdyb3Vwc1dpdGhUYWJzIH07XHJcbiAgICAgIH0pLFxyXG4gICAgKTtcclxuXHJcbiAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlLCBkYXRhIH0pO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfSk7XHJcblxyXG4gIGJyb3dzZXIuYWN0aW9uLm9uQ2xpY2tlZC5hZGRMaXN0ZW5lcigoKSA9PiB7XHJcbiAgICB2b2lkIG9wZW5UYWJQbGFuKCk7XHJcbiAgfSk7XHJcblxyXG4gIGJyb3dzZXIuY29tbWFuZHMub25Db21tYW5kLmFkZExpc3RlbmVyKChjb21tYW5kKSA9PiB7XHJcbiAgICBpZiAoY29tbWFuZCA9PT0gXCJ0b2dnbGUtdGFicGxhblwiKSB7XHJcbiAgICAgIHZvaWQgb3BlblRhYlBsYW4oKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgYnJvd3Nlci53aW5kb3dzLm9uUmVtb3ZlZC5hZGRMaXN0ZW5lcigod2luZG93SWQpID0+IHtcclxuICAgIGlmICh3aW5kb3dJZCA9PT0gdGFiUGxhbldpbmRvd0lkKSB7XHJcbiAgICAgIHRhYlBsYW5XaW5kb3dJZCA9IG51bGw7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn0pO1xyXG4iLCIvLyNyZWdpb24gc3JjL2luZGV4LnRzXG4vKipcbiogQ2xhc3MgZm9yIHBhcnNpbmcgYW5kIHBlcmZvcm1pbmcgb3BlcmF0aW9ucyBvbiBtYXRjaCBwYXR0ZXJucy5cbipcbiogQGV4YW1wbGVcbiogICBjb25zdCBwYXR0ZXJuID0gbmV3IE1hdGNoUGF0dGVybignKjovL2dvb2dsZS5jb20vKicpO1xuKlxuKiAgIHBhdHRlcm4uaW5jbHVkZXMoJ2h0dHBzOi8vZ29vZ2xlLmNvbScpOyAvLyB0cnVlXG4qICAgcGF0dGVybi5pbmNsdWRlcygnaHR0cDovL3lvdXR1YmUuY29tL3dhdGNoP3Y9MTIzJyk7IC8vIGZhbHNlXG4qL1xudmFyIE1hdGNoUGF0dGVybiA9IGNsYXNzIE1hdGNoUGF0dGVybiB7XG5cdHN0YXRpYyB7XG5cdFx0dGhpcy5QUk9UT0NPTFMgPSBbXG5cdFx0XHRcImh0dHBcIixcblx0XHRcdFwiaHR0cHNcIixcblx0XHRcdFwiZmlsZVwiLFxuXHRcdFx0XCJmdHBcIixcblx0XHRcdFwidXJuXCIsXG5cdFx0XHRcIndzXCIsXG5cdFx0XHRcIndzc1wiXG5cdFx0XTtcblx0fVxuXHQvKipcblx0KiBQYXJzZSBhIG1hdGNoIHBhdHRlcm4gc3RyaW5nLiBJZiBpdCBpcyBpbnZhbGlkLCB0aGUgY29uc3RydWN0b3Igd2lsbCB0aHJvdyBhblxuXHQqIGBJbnZhbGlkTWF0Y2hQYXR0ZXJuYCBlcnJvci5cblx0KlxuXHQqIEBwYXJhbSBtYXRjaFBhdHRlcm4gVGhlIG1hdGNoIHBhdHRlcm4gdG8gcGFyc2UuXG5cdCovXG5cdGNvbnN0cnVjdG9yKG1hdGNoUGF0dGVybikge1xuXHRcdGlmIChtYXRjaFBhdHRlcm4gPT09IFwiPGFsbF91cmxzPlwiKSB7XG5cdFx0XHR0aGlzLmlzQWxsVXJscyA9IHRydWU7XG5cdFx0XHR0aGlzLnByb3RvY29sTWF0Y2hlcyA9IFsuLi5NYXRjaFBhdHRlcm4uUFJPVE9DT0xTXTtcblx0XHRcdHRoaXMuaG9zdG5hbWVNYXRjaCA9IFwiKlwiO1xuXHRcdFx0dGhpcy5wYXRobmFtZU1hdGNoID0gXCIqXCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGdyb3VwcyA9IC8oLiopOlxcL1xcLyguKj8pKFxcLy4qKS8uZXhlYyhtYXRjaFBhdHRlcm4pO1xuXHRcdFx0aWYgKGdyb3VwcyA9PSBudWxsKSB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihtYXRjaFBhdHRlcm4sIFwiSW5jb3JyZWN0IGZvcm1hdFwiKTtcblx0XHRcdGNvbnN0IFtfLCBwcm90b2NvbCwgaG9zdG5hbWUsIHBhdGhuYW1lXSA9IGdyb3Vwcztcblx0XHRcdHZhbGlkYXRlUHJvdG9jb2wobWF0Y2hQYXR0ZXJuLCBwcm90b2NvbCk7XG5cdFx0XHR2YWxpZGF0ZUhvc3RuYW1lKG1hdGNoUGF0dGVybiwgaG9zdG5hbWUpO1xuXHRcdFx0dGhpcy5wcm90b2NvbE1hdGNoZXMgPSBwcm90b2NvbCA9PT0gXCIqXCIgPyBbXCJodHRwXCIsIFwiaHR0cHNcIl0gOiBbcHJvdG9jb2xdO1xuXHRcdFx0dGhpcy5ob3N0bmFtZU1hdGNoID0gaG9zdG5hbWU7XG5cdFx0XHR0aGlzLnBhdGhuYW1lTWF0Y2ggPSBwYXRobmFtZTtcblx0XHR9XG5cdH1cblx0LyoqIENoZWNrIGlmIGEgVVJMIGlzIGluY2x1ZGVkIGluIGEgcGF0dGVybi4gKi9cblx0aW5jbHVkZXModXJsKSB7XG5cdFx0Y29uc3QgdSA9IHR5cGVvZiB1cmwgPT09IFwic3RyaW5nXCIgPyBuZXcgVVJMKHVybCkgOiB1cmwgaW5zdGFuY2VvZiBMb2NhdGlvbiA/IG5ldyBVUkwodXJsLmhyZWYpIDogdXJsO1xuXHRcdGlmICh0aGlzLmlzQWxsVXJscykgcmV0dXJuICF0aGlzLmlzVW5rbm93blByb3RvY29sKHUpO1xuXHRcdHJldHVybiAhIXRoaXMucHJvdG9jb2xNYXRjaGVzLmZpbmQoKHByb3RvY29sKSA9PiB7XG5cdFx0XHRpZiAocHJvdG9jb2wgPT09IFwiaHR0cFwiKSByZXR1cm4gdGhpcy5pc0h0dHBNYXRjaCh1KTtcblx0XHRcdGlmIChwcm90b2NvbCA9PT0gXCJodHRwc1wiKSByZXR1cm4gdGhpcy5pc0h0dHBzTWF0Y2godSk7XG5cdFx0XHRpZiAocHJvdG9jb2wgPT09IFwiZmlsZVwiKSByZXR1cm4gdGhpcy5pc0ZpbGVNYXRjaCh1KTtcblx0XHRcdGlmIChwcm90b2NvbCA9PT0gXCJmdHBcIikgcmV0dXJuIHRoaXMuaXNGdHBNYXRjaCh1KTtcblx0XHRcdGlmIChwcm90b2NvbCA9PT0gXCJ1cm5cIikgcmV0dXJuIHRoaXMuaXNVcm5NYXRjaCh1KTtcblx0XHR9KTtcblx0fVxuXHRpc0h0dHBNYXRjaCh1cmwpIHtcblx0XHRyZXR1cm4gdXJsLnByb3RvY29sID09PSBcImh0dHA6XCIgJiYgdGhpcy5pc0hvc3RQYXRoTWF0Y2godXJsKTtcblx0fVxuXHRpc0h0dHBzTWF0Y2godXJsKSB7XG5cdFx0cmV0dXJuIHVybC5wcm90b2NvbCA9PT0gXCJodHRwczpcIiAmJiB0aGlzLmlzSG9zdFBhdGhNYXRjaCh1cmwpO1xuXHR9XG5cdGlzSG9zdFBhdGhNYXRjaCh1cmwpIHtcblx0XHRpZiAoIXRoaXMuaG9zdG5hbWVNYXRjaCB8fCAhdGhpcy5wYXRobmFtZU1hdGNoKSByZXR1cm4gZmFsc2U7XG5cdFx0Y29uc3QgaG9zdG5hbWVNYXRjaFJlZ2V4cyA9IFt0aGlzLmNvbnZlcnRQYXR0ZXJuVG9SZWdleCh0aGlzLmhvc3RuYW1lTWF0Y2gpLCB0aGlzLmNvbnZlcnRQYXR0ZXJuVG9SZWdleCh0aGlzLmhvc3RuYW1lTWF0Y2gucmVwbGFjZSgvXlxcKlxcLi8sIFwiXCIpKV07XG5cdFx0Y29uc3QgcGF0aG5hbWVNYXRjaFJlZ2V4ID0gdGhpcy5jb252ZXJ0UGF0dGVyblRvUmVnZXgodGhpcy5wYXRobmFtZU1hdGNoKTtcblx0XHRyZXR1cm4gISFob3N0bmFtZU1hdGNoUmVnZXhzLmZpbmQoKHJlZ2V4KSA9PiByZWdleC50ZXN0KHVybC5ob3N0bmFtZSkpICYmIHBhdGhuYW1lTWF0Y2hSZWdleC50ZXN0KHVybC5wYXRobmFtZSk7XG5cdH1cblx0aXNVbmtub3duUHJvdG9jb2wodXJsKSB7XG5cdFx0cmV0dXJuICF0aGlzLnByb3RvY29sTWF0Y2hlcy5pbmNsdWRlcyh1cmwucHJvdG9jb2wuc2xpY2UoMCwgLTEpKTtcblx0fVxuXHRpc1BhdGhNYXRjaCh1cmwpIHtcblx0XHRpZiAoIXRoaXMucGF0aG5hbWVNYXRjaCkgcmV0dXJuIGZhbHNlO1xuXHRcdHJldHVybiB0aGlzLmNvbnZlcnRQYXR0ZXJuVG9SZWdleCh0aGlzLnBhdGhuYW1lTWF0Y2gpLnRlc3QodXJsLnBhdGhuYW1lKTtcblx0fVxuXHRpc0ZpbGVNYXRjaCh1cmwpIHtcblx0XHRyZXR1cm4gdXJsLnByb3RvY29sID09PSBcImZpbGU6XCIgJiYgdGhpcy5pc1BhdGhNYXRjaCh1cmwpO1xuXHR9XG5cdGlzRnRwTWF0Y2goX3VybCkge1xuXHRcdHRocm93IEVycm9yKFwiTm90IGltcGxlbWVudGVkOiBmdHA6Ly8gcGF0dGVybiBtYXRjaGluZy4gT3BlbiBhIFBSIHRvIGFkZCBzdXBwb3J0XCIpO1xuXHR9XG5cdGlzVXJuTWF0Y2goX3VybCkge1xuXHRcdHRocm93IEVycm9yKFwiTm90IGltcGxlbWVudGVkOiB1cm46Ly8gcGF0dGVybiBtYXRjaGluZy4gT3BlbiBhIFBSIHRvIGFkZCBzdXBwb3J0XCIpO1xuXHR9XG5cdGNvbnZlcnRQYXR0ZXJuVG9SZWdleChwYXR0ZXJuKSB7XG5cdFx0Y29uc3Qgc3RhcnNSZXBsYWNlZCA9IHRoaXMuZXNjYXBlRm9yUmVnZXgocGF0dGVybikucmVwbGFjZSgvXFxcXFxcKi9nLCBcIi4qXCIpO1xuXHRcdHJldHVybiBSZWdFeHAoYF4ke3N0YXJzUmVwbGFjZWR9JGApO1xuXHR9XG5cdGVzY2FwZUZvclJlZ2V4KHN0cmluZykge1xuXHRcdHJldHVybiBzdHJpbmcucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xuXHR9XG59O1xudmFyIEludmFsaWRNYXRjaFBhdHRlcm4gPSBjbGFzcyBleHRlbmRzIEVycm9yIHtcblx0Y29uc3RydWN0b3IobWF0Y2hQYXR0ZXJuLCByZWFzb24pIHtcblx0XHRzdXBlcihgSW52YWxpZCBtYXRjaCBwYXR0ZXJuIFwiJHttYXRjaFBhdHRlcm59XCI6ICR7cmVhc29ufWApO1xuXHR9XG59O1xuZnVuY3Rpb24gdmFsaWRhdGVQcm90b2NvbChtYXRjaFBhdHRlcm4sIHByb3RvY29sKSB7XG5cdGlmICghTWF0Y2hQYXR0ZXJuLlBST1RPQ09MUy5pbmNsdWRlcyhwcm90b2NvbCkgJiYgcHJvdG9jb2wgIT09IFwiKlwiKSB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihtYXRjaFBhdHRlcm4sIGAke3Byb3RvY29sfSBub3QgYSB2YWxpZCBwcm90b2NvbCAoJHtNYXRjaFBhdHRlcm4uUFJPVE9DT0xTLmpvaW4oXCIsIFwiKX0pYCk7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZUhvc3RuYW1lKG1hdGNoUGF0dGVybiwgaG9zdG5hbWUpIHtcblx0aWYgKGhvc3RuYW1lLmluY2x1ZGVzKFwiOlwiKSkgdGhyb3cgbmV3IEludmFsaWRNYXRjaFBhdHRlcm4obWF0Y2hQYXR0ZXJuLCBgSG9zdG5hbWUgY2Fubm90IGluY2x1ZGUgYSBwb3J0YCk7XG5cdGlmIChob3N0bmFtZS5pbmNsdWRlcyhcIipcIikgJiYgaG9zdG5hbWUubGVuZ3RoID4gMSAmJiAhaG9zdG5hbWUuc3RhcnRzV2l0aChcIiouXCIpKSB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihtYXRjaFBhdHRlcm4sIGBJZiB1c2luZyBhIHdpbGRjYXJkICgqKSwgaXQgbXVzdCBnbyBhdCB0aGUgc3RhcnQgb2YgdGhlIGhvc3RuYW1lYCk7XG59XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IEludmFsaWRNYXRjaFBhdHRlcm4sIE1hdGNoUGF0dGVybiB9O1xuIl0sInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswLDEsMiw0XSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0NDZ0JBLElBQU0sVURmaUIsV0FBVyxTQUFTLFNBQVMsS0FDaEQsV0FBVyxVQUNYLFdBQVc7OztDRUZmLFNBQVMsaUJBQWlCLEtBQUs7RUFDOUIsSUFBSSxPQUFPLFFBQVEsT0FBTyxRQUFRLFlBQVksT0FBTyxFQUFFLE1BQU0sSUFBSTtFQUNqRSxPQUFPO0NBQ1I7OztDQ0RBLElBQUEscUJBQWUsdUJBQXVCO0VBQ3BDLElBQUksa0JBQWlDO0VBRXJDLGVBQWUsY0FBYztHQUMzQixJQUFJLG9CQUFvQixNQUN0QixJQUFJO0lBQ0YsTUFBTSxRQUFRLFFBQVEsSUFBSSxlQUFlO0lBQ3pDLE1BQU0sUUFBUSxRQUFRLE9BQU8saUJBQWlCLEVBQUUs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