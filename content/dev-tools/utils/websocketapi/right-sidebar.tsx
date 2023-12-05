import * as React from "react";

import { useTranslate } from "@portal/hooks";
import { Link } from "@redocly/portal/dist/client/App/Link";

interface RightSideBarProps {
  commandList: any;
  currentMethod: any;
  setCurrentMethod: any;
}

export const RightSideBar: React.FC<RightSideBarProps> = ({
  commandList,
  currentMethod,
  setCurrentMethod,
}) => {
  const { translate } = useTranslate();
  return (
    <div className="command-list-wrapper">
      <div className="toc-header">
        <h4>{translate("API Methods")}</h4>
      </div>
      <ul className="command-list" id="command_list">
        {commandList.map((list) => (
          <>
            <li className="separator">{list.group}</li>
            {list.methods.map((method) => (
              <li
                className={`method${method === currentMethod ? " active" : ""}`}
                key={method.id}
              >
                <Link
                  to={`dev-tools/websocket-api-tool#${method.name}`}
                  onClick={() => setCurrentMethod(method)}
                >
                  {method.name}
                </Link>
              </li>
            ))}
          </>
        ))}
      </ul>
    </div>
  );
};
