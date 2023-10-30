import * as React from "react";
import { useTranslate } from "@portal/hooks";

const connections = [
  {
    id: "wstool-1-connection-s1",
    ws_url: "wss://s1.ripple.com/",
    jsonrpc_url: "https://s1.ripple.com:51234/",
    shortname: "Mainnet s1",
    longname: "s1.ripple.com (Mainnet Public Cluster)",
  },
  {
    id: "wstool-1-connection-xrplcluster",
    ws_url: "wss://xrplcluster.com/",
    jsonrpc_url: "https://xrplcluster.com/",
    shortname: "Mainnet xrplcluster",
    longname: "xrplcluster.com (Mainnet Full History Cluster)",
  },
  {
    id: "wstool-1-connection-s2",
    ws_url: "wss://s2.ripple.com/",
    jsonrpc_url: "https://s2.ripple.com:51234/",
    shortname: "Mainnet s2",
    longname: "s2.ripple.com (Mainnet Full History Cluster)",
  },
  {
    id: "wstool-1-connection-testnet",
    ws_url: "wss://s.altnet.rippletest.net:51233/",
    jsonrpc_url: "https://s.altnet.rippletest.net:51234/",
    shortname: "Testnet",
    longname: "s.altnet.rippletest.net (Testnet Public Cluster)",
  },
  {
    id: "wstool-1-connection-devnet",
    ws_url: "wss://s.devnet.rippletest.net:51233/",
    jsonrpc_url: "https://s.devnet.rippletest.net:51234/",
    shortname: "Devnet",
    longname: "s.devnet.rippletest.net (Devnet Public Cluster)",
  },
  {
    id: "wstool-1-connection-ammdevnet",
    ws_url: "wss://amm.devnet.rippletest.net:51233/",
    jsonrpc_url: "https://amm.devnet.rippletest.net:51234/",
    shortname: "AMM-Devnet",
    longname: "amm.devnet.rippletest.net (XLS-30d AMM Devnet)",
  },
  {
    id: "wstool-1-connection-localhost",
    ws_url: "ws://localhost:6006/",
    jsonrpc_url: "http://localhost:5005/",
    shortname: "Local server",
    longname:
      'localhost:6006 (Local <code>rippled</code> Server on port 6006) <br/>\n              <small>(Requires that you <a href="install-rippled.html">run <code>rippled</code></a> on this machine with default WebSocket settings)</small>',
  },
];

const rightSideBar = () => {
  const { translate } = useTranslate();
  return (
    <div className="command-list-wrapper">
      <div className="toc-header">
        <h4>{translate("API Methods")}</h4>
      </div>
      <ul className="command-list" id="command_list"></ul>
    </div>
  );
};

export default function WebsocketApiTool() {
  const { translate } = useTranslate();
  return (
    <section
      className="container-fluid pt-3 p-md-3 websocket-tool"
      id="wstool-1"
    >
      <h1>{translate("WebSocket Tool")}</h1>
      <div className="api-method-description-wrapper">
        <h3>
          <a href="server_info.html" className="selected_command">
            server_info
          </a>
        </h3>
        <p className="blurb">
          {translate(
            "Get information about the state of the server, formatted for human consumption."
          )}
        </p>
        <a
          className="btn btn-outline-secondary api-readmore"
          href="server_info.html"
        >
          {translate("Read more")}
        </a>
      </div>

      <div className="api-input-area pt-4">
        <h4>{translate("Request")}</h4>
        <div className="request-body"></div>
        <div className="btn-toolbar justify-content-between" role="toolbar">
          <div className="btn-group mr-3" role="group">
            <button className="btn btn-outline-secondary send-request">
              {translate("Send request")}
            </button>
            <div
              className="input-group loader send-loader"
              style={{ display: "none" }}
            >
              <span className="input-group-append">
                <img
                  alt="(loading)"
                  src="{{currentpage.prefix}}assets/img/xrp-loader-96.png"
                  height="24"
                  width="24"
                />
              </span>
            </div>
          </div>
          <div className="btn-group request-options" role="group">
            <button
              className="btn btn-outline-secondary connection"
              data-toggle="modal"
              data-target="#wstool-1-connection-settings"
            >
              {translate("Offline (Mainnet)")}
            </button>
            <div
              className="input-group loader connect-loader"
              style={{ display: "none" }}
            >
              <span className="input-group-append">
                <img
                  alt="(loading)"
                  src="{{currentpage.prefix}}assets/img/xrp-loader-96.png"
                  height="24"
                  width="24"
                />
              </span>
            </div>
            <button
              className="btn btn-outline-secondary permalink"
              data-toggle="modal"
              data-target="#wstool-1-permalink"
              title="Permalink"
            >
              <i className="fa fa-link"></i>
            </button>
            <button
              className="btn btn-outline-secondary curl"
              data-toggle="modal"
              data-target="#wstool-1-curl"
              title="cURL syntax"
            >
              <i className="fa fa-terminal"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="api-response-area pt-4">
        <h4>{translate("Responses")}</h4>

        <div
          className="btn-toolbar justify-content-between response-options"
          role="toolbar"
        >
          <div className="input-group">
            <div className="input-group-prepend">
              <div className="input-group-text" id="wstool-1-keep-last-label">
                {translate("Keep last:")}
              </div>
            </div>
            <input
              type="number"
              value="50"
              min="1"
              aria-label="Number of responses to keep at once"
              aria-describedby="wstool-1-keep-last-label"
              className="form-control keep-last"
            />
          </div>

          <div className="btn-group" role="group">
            <button
              className="btn btn-outline-secondary stream-pause"
              title="Pause Subscriptions"
            >
              <i className="fa fa-pause"></i>
            </button>
            <button
              className="btn btn-outline-secondary stream-unpause"
              title="Unpause Subscriptions"
              style={{ display: "none" }}
            >
              <i className="fa fa-play"></i>
            </button>
            <button
              className="btn btn-outline-secondary wipe-responses"
              title="Delete All Responses"
            >
              <i className="fa fa-trash"></i>
            </button>
          </div>
        </div>

        <div className="response-body-wrapper"></div>
      </div>
    </section>
  );
}
