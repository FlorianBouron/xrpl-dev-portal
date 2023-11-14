import * as React from "react";

interface PermaLinkProps {
  permanentLinkRef: any;
  closePermanentLinkModal: any;
  currentMethod: any;
  selectedConnection: any;
}

interface CurlProps {
  curlRef: any;
  closeCurlModal: any;
  currentMethod: any;
  selectedConnection: any;
}

interface ConnectionProps {
  selectedConnection: any;
  handleConnectionChange: any;
  closeConnectionModal: any;
  connections: any;
}

export const PermanentLinkModal: React.FC<PermaLinkProps> = ({
  permanentLinkRef,
  closePermanentLinkModal,
  currentMethod,
  selectedConnection,
}) => (
  <div
    className="modal fade show"
    id="wstool-1-permalink"
    tabIndex={-1}
    role="dialog"
    aria-hidden="true"
  >
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Permalink</h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <form>
            <div className="form-group">
              <label htmlFor="permalink-box-1">
                Share the following link to load this page with the
                currently-loaded inputs:
              </label>
              <textarea
                id="permalink-box-1"
                className="form-control"
                ref={permanentLinkRef}
              >
                {getPermalink(selectedConnection, currentMethod)}
              </textarea>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button
            title="Copy to clipboard"
            className="btn btn-outline-secondary clipboard-btn"
            data-clipboard-target="#permalink-box-1"
            id="permalink-box-1button"
            onClick={() =>
              copyToClipboard(
                permanentLinkRef,
                getPermalink(selectedConnection, currentMethod)
              )
            }
          >
            <i className="fa fa-clipboard"></i>
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            data-dismiss="modal"
            onClick={closePermanentLinkModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
);

export const CurlModal: React.FC<CurlProps> = ({
  curlRef,
  closeCurlModal,
  currentMethod,
  selectedConnection,
}) => (
  <div
    className="modal fade show"
    id="wstool-1-curl"
    tabIndex={-1}
    role="dialog"
    aria-hidden="true"
  >
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">cURL Syntax</h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <form>
            <div className="form-group">
              <label htmlFor="curl-box-1">
                Use the following syntax to make the equivalent JSON-RPC request
                using <a href="https://curl.se/">cURL</a> from a commandline
                interface:
              </label>
              <textarea
                id="curl-box-1"
                className="form-control"
                rows={8}
                ref={curlRef}
              >
                {getCurl(currentMethod, selectedConnection)}
              </textarea>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button
            title="Copy to clipboard"
            className="btn btn-outline-secondary clipboard-btn"
            data-clipboard-target="#curl-box-1"
            id="curl-box-1button"
            onClick={() =>
              copyToClipboard(
                curlRef,
                getCurl(currentMethod, selectedConnection)
              )
            }
          >
            <i className="fa fa-clipboard"></i>
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            data-dismiss="modal"
            onClick={closeCurlModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
);

export const ConnectionModal: React.FC<ConnectionProps> = ({
  selectedConnection,
  handleConnectionChange,
  closeConnectionModal,
  connections,
}) => {
  return (
    <div
      className="modal fade"
      id="wstool-1-connection-settings"
      tabIndex={-1}
      role="dialog"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Connection Settings</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {connections.map((conn) => (
              <div className="form-check" key={conn.id}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="wstool-1-connection"
                  id={conn.id}
                  value={conn.id}
                  data-jsonrpcurl={conn.jsonrpc_url}
                  data-shortname={conn.shortname}
                  checked={selectedConnection.id === conn.id}
                  onChange={handleConnectionChange}
                />
                <label className="form-check-label" htmlFor={conn.id}>
                  <div dangerouslySetInnerHTML={{ __html: conn.longname }} />
                </label>
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              data-dismiss="modal"
              onClick={closeConnectionModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const getPermalink = (selectedConnection, currentMethod) => {
  const startHref = window.location.origin + window.location.pathname;
  const encodedBody = encodeURIComponent(get_compressed_body(currentMethod));
  const encodedServer = encodeURIComponent(selectedConnection.id);
  return `${startHref}?server=${encodedServer}&req=${encodedBody}`;
};

function get_compressed_body(currentMethod) {
  let compressed_body;
  try {
    const body_json = currentMethod.body;
    compressed_body = JSON.stringify(body_json, null, null);
  } catch (e) {
    // Probably invalid JSON. We'll make a permalink anyway, but we can't
    // compress all the whitespace because we don't know what's escaped. We can
    // assume that newlines are irrelevant because the rippled APIs don't accept
    // newlines in strings anywhere
    compressed_body = currentMethod.body.toString().replace("\n", "").trim();
  }

  return compressed_body;
}

const copyToClipboard = async (textareaRef, textareaValue) => {
  if (textareaRef.current) {
    textareaRef.current.select();
    textareaRef.current.focus();
    await navigator.clipboard.writeText(textareaValue);
  }
};

const getCurl = function (currentMethod, selectedConnection) {
  let body;
  try {
    // change WS to JSON-RPC syntax
    const params = JSON.parse(JSON.stringify(currentMethod.body));
    delete params.id;
    const method = params.command;
    delete params.command;
    const body_json = { method: method, params: [params] };
    body = JSON.stringify(body_json, null, null);
  } catch (e) {
    alert("Can't provide curl format of invalid JSON syntax");
    return;
  }

  const server = selectedConnection.jsonrpc_url;

  return `curl -H 'Content-Type: application/json' -d '${body}' ${server}`;
};
