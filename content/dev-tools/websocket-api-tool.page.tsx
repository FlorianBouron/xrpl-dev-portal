import React, { useEffect, useState, useRef } from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";
import { useLocation } from "react-router-dom";

import { useTranslate } from "@portal/hooks";
import { Link } from "@redocly/portal/dist/client/App/Link";
import { PermalinkModal } from "./utils/websocketapi/permalink-modal";
import { CurlModal } from "./utils/websocketapi/curl-modal";
import { ConnectionModal } from "./utils/websocketapi/connection-modal";

import commandList from "./utils/data/command-list.json";
import connections from "./utils/data/connections.json";
import { RightSideBar } from "./utils/websocketapi/right-sidebar";

if (typeof window !== "undefined" && typeof window.navigator !== "undefined") {
  require("codemirror/mode/javascript/javascript");
}

export default function WebsocketApiTool() {
  const { hash: slug } = useLocation();
  const { translate } = useTranslate();
  const [isConnectionModalVisible, setIsConnectionModalVisible] =
    useState(false);
  const [selectedConnection, setSelectedConnection] = useState(connections[0]);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [keepLast, setKeepLast] = useState(50);
  const [streamPaused, setStreamPaused] = useState(false);
  const streamPausedRef = useRef(streamPaused);
  const [isPermalinkModalVisible, setIsPermalinkModalVisible] = useState(false);
  const [isCurlModalVisible, setIsCurlModalVisible] = useState(false);

  const getInitialMethod = () => {
    if (slug) {
      for (const group of commandList) {
        for (const method of group.methods) {
          if (method.name === slug.slice(1)) {
            return method;
          }
        }
      }
    }
    return commandList[0].methods[0];
  };

  const [currentMethod, setCurrentMethod] = useState(getInitialMethod);
  streamPausedRef.current = streamPaused;

  const handleCurrentMethodChange = (editor, data, value) => {
    const newBody = JSON.parse(value);

    setCurrentMethod((previousMethod) => {
      previousMethod.body = newBody;
      return previousMethod;
    });
  };

  const handleConnectionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedConnection(selectedValue);

    const foundConnection = connections.find(
      (conn) => conn.id === selectedValue
    );

    setSelectedConnection(foundConnection);
  };

  const handleKeepLastChange = (event) => {
    const newValue = event.target.value;
    setKeepLast(newValue);
  };

  const openConnectionModal = () => {
    setIsConnectionModalVisible(true);
  };

  const closeConnectionModal = () => {
    setIsConnectionModalVisible(false);
  };

  const openPermalinkModal = () => {
    setIsPermalinkModalVisible(true);
  };
  const closePermalinkModal = () => {
    setIsPermalinkModalVisible(false);
  };

  const openCurlModal = () => {
    setIsCurlModalVisible(true);
  };

  const closeCurlModal = () => {
    setIsCurlModalVisible(false);
  };

  const [ws, setWs] = useState(null);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const newWs = new WebSocket(selectedConnection.ws_url);
    setWs(newWs);
    newWs.onopen = function handleOpen(event) {
      setConnected(true);
      setConnectionError(false);
    };

    newWs.onclose = function handleClose(event) {
      if (event.wasClean) {
        setConnected(false);
      } else {
        console.debug(
          "socket close event discarded (new socket status already provided):",
          event
        );
      }
    };

    newWs.onerror = function handleError(event) {
      setConnectionError(true);
      console.error("socket error:", event);
    };

    newWs.onmessage = function handleMessage(event) {
      const message = event.data;
      let data;
      try {
        data = JSON.parse(message);
      } catch (error) {
        console.error("Error parsing validation message", error);
        return;
      }
      if (data.type === "response" || !streamPausedRef.current) {
        setResponses((prevResponses) =>
          [JSON.stringify(data, null, 2)].concat(prevResponses)
        );
      }
    };

    return () => {
      newWs.close();
    };
  }, [selectedConnection.ws_url]);

  useEffect(() => {
    if (responses.length > keepLast) {
      setResponses(responses.slice(0, keepLast));
    }
  }, [responses, keepLast]);

  const sendWebSocketMessage = (messageBody) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(messageBody));
    }
  };

  const PermalinkRef = useRef(null);
  const curlRef = useRef(null);

  return (
    <div className="container-fluid" role="document" id="main_content_wrapper">
      <div className="row">
        <aside
          className="right-sidebar col-lg-3 order-lg-4"
          role="complementary"
        >
          <RightSideBar
            commandList={commandList}
            currentMethod={currentMethod}
            setCurrentMethod={setCurrentMethod}
          />
        </aside>
        <main
          className="main col-md-7 col-lg-6 order-md-3  "
          role="main"
          id="main_content_body"
        >
          <section
            className="container-fluid pt-3 p-md-3 websocket-tool"
            id="wstool-1"
          >
            <h1>{translate("WebSocket Tool")}</h1>
            <div className="api-method-description-wrapper">
              <h3>
                <a
                  href={`${currentMethod.name.split(" ")[0]}.html`}
                  className="selected_command"
                >
                  {currentMethod.name}
                </a>
              </h3>
              <p className="blurb">
                <div
                  dangerouslySetInnerHTML={{
                    __html: currentMethod.description,
                  }}
                />
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
              <div className="request-body">
                <CodeMirror
                  value={JSON.stringify(currentMethod.body, null, 2)}
                  options={{
                    mode: "javascript",
                    json: true,
                    smartIndent: false,
                    gutters: ["CodeMirror-lint-markers"],
                    lint: true,
                  }}
                  onChange={handleCurrentMethodChange}
                />
              </div>
              <div
                className="btn-toolbar justify-content-between"
                role="toolbar"
              >
                <div className="btn-group mr-3" role="group">
                  <button
                    className="btn btn-outline-secondary send-request"
                    onClick={() => sendWebSocketMessage(currentMethod.body)}
                  >
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
                    className={`btn connection ${
                      connected ? "btn-success" : "btn-outline-secondary"
                    } ${connectionError ?? "btn-danger"}`}
                    data-toggle="modal"
                    data-target="#wstool-1-connection-settings"
                    onClick={openConnectionModal}
                  >
                    {`${selectedConnection.shortname}${
                      connected ? " (Connected)" : " (Not Connected)"
                    }${connectionError ? " (Failed to Connect)" : ""}`}
                  </button>
                  {isConnectionModalVisible && (
                    <ConnectionModal
                      selectedConnection={selectedConnection}
                      handleConnectionChange={handleConnectionChange}
                      closeConnectionModal={closeConnectionModal}
                      connections={connections}
                    />
                  )}
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
                    onClick={openPermalinkModal}
                  >
                    <i className="fa fa-link"></i>
                  </button>
                  {isPermalinkModalVisible && (
                    <PermalinkModal
                      permalinkRef={PermalinkRef}
                      closePermalinkModal={closePermalinkModal}
                      currentMethod={currentMethod}
                      selectedConnection={selectedConnection}
                    />
                  )}
                  <button
                    className="btn btn-outline-secondary curl"
                    data-toggle="modal"
                    data-target="#wstool-1-curl"
                    title="cURL syntax"
                    onClick={openCurlModal}
                  >
                    <i className="fa fa-terminal"></i>
                  </button>
                  {isCurlModalVisible && (
                    <CurlModal
                      curlRef={curlRef}
                      closeCurlModal={closeCurlModal}
                      currentMethod={currentMethod}
                      selectedConnection={selectedConnection}
                    />
                  )}
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
                    <div
                      className="input-group-text"
                      id="wstool-1-keep-last-label"
                    >
                      {translate("Keep last:")}
                    </div>
                  </div>
                  <input
                    type="number"
                    value={keepLast}
                    min="1"
                    aria-label="Number of responses to keep at once"
                    aria-describedby="wstool-1-keep-last-label"
                    className="form-control keep-last"
                    onChange={handleKeepLastChange}
                  />
                </div>

                <div className="btn-group" role="group">
                  {!streamPaused && (
                    <button
                      className="btn btn-outline-secondary stream-pause"
                      title="Pause Subscriptions"
                      onClick={() => setStreamPaused(true)}
                    >
                      <i className="fa fa-pause"></i>
                    </button>
                  )}
                  {streamPaused && (
                    <button
                      className="btn btn-outline-secondary stream-unpause"
                      title="Unpause Subscriptions"
                      onClick={() => setStreamPaused(false)}
                    >
                      <i className="fa fa-play"></i>
                    </button>
                  )}
                  <button
                    className="btn btn-outline-secondary wipe-responses"
                    title="Delete All Responses"
                    onClick={() => setResponses([])}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </div>
              </div>

              <div className="response-body-wrapper">
                {responses.map((response) => (
                  <div className="response-metadata">
                    <span className="timestamp">
                      {new Date().toISOString()}
                    </span>
                    <div className="response-json">
                      <CodeMirror
                        value={response}
                        options={{
                          mode: "javascript",
                          json: true,
                          smartIndent: false,
                          gutters: ["CodeMirror-lint-markers"],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
