/*!
 * @source: https://codeberg.org/kytta/toot/src/branch/main/src/main.js
 *
 * @licstart  The following is the entire license notice for the
 *            JavaScript code in this page.
 *
 * toot - Cross-instance share page for Mastodon
 * Copyright (C) 2020-2022  Nikita Karamov <me@kytta.dev>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @licend  The above is the entire license notice
 *          for the JavaScript code in this page.
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

const INSTANCE_LIST_URL = "https://api.joinmastodon.org/servers";
const LOCAL_STORAGE_KEY = "recentInstances";
const RECENT_INSTANCES_SIZE = 5;

const $instance = document.getElementById("instance");
const $instanceDatalist = document.getElementById("instanceDatalist");

/**
 * Adds missing "https://" and ending slash to the URL
 *
 * @param {string} url URL to normalize
 * @return {string} normalized URL
 */
function normalizeUrl(url) {
	if (url.indexOf("http://") == -1 && url.indexOf("https://") == -1) {
		url = "https://" + url;
	}
	if (url.charAt(url.length - 1) !== "/") {
		url = url + "/";
	}
	return url;
}

function onLoadInstancesError() {
	console.error("Couldn't load instance list");
}

function onLoadInstancesSuccess() {
	if (this.status >= 400) {
		return onLoadInstancesError();
	}

	const currentInstance = $instance.value;
	const instanceDomains = JSON.parse(this.responseText).map((i) => i.domain);
	if (currentInstance && instanceDomains.indexOf(currentInstance) < 0) {
		instanceDomains.push(currentInstance);
	}
	instanceDomains.sort();

	for (let i = 0; i < instanceDomains.length; i++) {
		const $option = document.createElement("option");
		$option.value = normalizeUrl(instanceDomains[i]);
		$instanceDatalist.appendChild($option);
	}
}

function loadInstances() {
	if ($instanceDatalist.children.length === 0) {
		const request = new XMLHttpRequest();

		request.addEventListener("load", onLoadInstancesSuccess);
		request.addEventListener("error", onLoadInstancesError);

		request.open("GET", INSTANCE_LIST_URL);
		request.send();
	}
}

function getRecentInstances() {
	const storedValue = window.localStorage.getItem(LOCAL_STORAGE_KEY);
	if (!storedValue) return [];
	return JSON.parse(storedValue);
}

function rememberInstance(instance) {
	const recentInstances = getRecentInstances();

	const index = recentInstances.indexOf(instance);
	if (index >= 0) {
		recentInstances.splice(index, 1);
	}
	recentInstances.unshift(instance);
	recentInstances.length = RECENT_INSTANCES_SIZE;

	window.localStorage.setItem(
		LOCAL_STORAGE_KEY,
		JSON.stringify(recentInstances)
	);
}

function onFormSubmit(form) {
	const formData = new FormData(form);

	if (formData.get("remember")) {
		rememberInstance(formData.get("instance"));
	}
	return true;
}

const prefillInstance = getRecentInstances()[0];

const URLParams = window.location.search.substr(1).split("&");
for (let i = 0; i < URLParams.length; i++) {
	const URLParamPair = URLParams[i].split("=");
	if (URLParamPair[0] === "text") {
		document.getElementById("text").value = decodeURIComponent(URLParamPair[1]);
	} else if (URLParamPair[0] === "url") {
		document.getElementById("url").value = decodeURIComponent(URLParamPair[1]);
	}  else if (URLParamPair[0] === "title") {
		document.getElementById("title").value = decodeURIComponent(URLParamPair[1]);
	} else if (URLParamPair[0] === "instance") {
		prefillInstance = decodeURIComponent(URLParamPair[1]);
	} else if (URLParamPair[0] === "shareonly") {
		if (document.getElementById("url").value !== "") {
			document.getElementById("url").readOnly = true;
		}
		if (document.getElementById("title").value !== "") {
			document.getElementById("title").readOnly = true;
		}
	}
}

if (prefillInstance != null) {
	$instance.value = normalizeUrl(prefillInstance);
}

$instance.addEventListener("focus", loadInstances);
