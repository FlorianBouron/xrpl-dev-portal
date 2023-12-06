import * as React from "react";

import { useTranslate } from "@portal/hooks";

interface CurlProps {
  curlRef: any;
  closeCurlModal: any;
  currentBody: any;
  selectedConnection: any;
}

const copyToClipboard = async (textareaRef, textareaValue) => {
  if (textareaRef.current) {
    textareaRef.current.select();
    textareaRef.current.focus();
    await navigator.clipboard.writeText(textareaValue);
  }
};

const getCurl = function (currentBody, selectedConnection) {
  let body;
  try {
    // change WS to JSON-RPC syntax
    const params = JSON.parse(currentBody);
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

export const CurlModal: React.FC<CurlProps> = ({
  curlRef,
  closeCurlModal,
  currentBody,
  selectedConnection,
}) => {
  const { translate } = useTranslate();
  return (
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
            <h5 className="modal-title">{translate("cURL Syntax")}</h5>
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
                  Use the following syntax to make the equivalent JSON-RPC
                  request using <a href="https://curl.se/">cURL</a> from a
                  commandline interface:
                </label>
                <textarea
                  id="curl-box-1"
                  className="form-control"
                  rows={8}
                  ref={curlRef}
                >
                  {getCurl(currentBody, selectedConnection)}
                </textarea>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              title="Copy to clipboard"
              className="btn btn-outline-secondary clipboard-btn"
              data-clipboard-target="#curl-box-1"
              id="curl-box-copy-button"
              onClick={() =>
                copyToClipboard(
                  curlRef,
                  getCurl(currentBody, selectedConnection)
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
};
