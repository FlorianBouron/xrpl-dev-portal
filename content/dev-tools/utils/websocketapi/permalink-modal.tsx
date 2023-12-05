import * as React from "react";

import { useTranslate } from "@portal/hooks";

interface PermaLinkProps {
  permalinkRef: any;
  closePermalinkModal: any;
  currentMethod: any;
  selectedConnection: any;
}

export const PermalinkModal: React.FC<PermaLinkProps> = ({
  permalinkRef,
  closePermalinkModal,
  currentMethod,
  selectedConnection,
}) => {
  const { translate } = useTranslate();
  return (
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
            <h5 className="modal-title">{translate("Permalink")}</h5>
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
                  {translate(
                    "Share the following link to load this page with the currently-loaded inputs:"
                  )}
                </label>
                <textarea
                  id="permalink-box-1"
                  className="form-control"
                  ref={permalinkRef}
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
                  permalinkRef,
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
              onClick={closePermalinkModal}
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
