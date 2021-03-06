import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { CellType } from "@nteract/commutable";
import { CodeOcticon, MarkdownOcticon } from "@nteract/octicons";
import * as actions from "@nteract/actions";
import { ContentRef } from "@nteract/types";

type Props = {
  above: boolean;
  createCell: (type: "code" | "markdown") => void;
};

type ConnectedProps = {
  above: boolean;
  createCellAppend: (
    payload: { cellType: CellType; contentRef: ContentRef }
  ) => void;
  createCellAbove: (
    payload: {
      cellType: CellType;
      id?: string;
      contentRef: ContentRef;
    }
  ) => void;
  createCellBelow: (
    payload: {
      cellType: CellType;
      id?: string;
      source: string;
      contentRef: ContentRef;
    }
  ) => void;
  id?: string;
  contentRef: ContentRef;
};

export class PureCellCreator extends React.Component<Props> {
  createMarkdownCell = () => {
    this.props.createCell("markdown");
  };

  createCodeCell = () => {
    this.props.createCell("code");
  };

  render() {
    return (
      <div className="creator-hover-mask">
        <div className="creator-hover-region">
          <div className="cell-creator">
            <button
              onClick={this.createMarkdownCell}
              title="create text cell"
              className="add-text-cell"
            >
              <span className="octicon">
                <MarkdownOcticon />
              </span>
            </button>
            <button
              onClick={this.createCodeCell}
              title="create code cell"
              className="add-code-cell"
            >
              <span className="octicon">
                <CodeOcticon />
              </span>
            </button>
          </div>
        </div>
        <style jsx>{`
          .creator-hover-mask {
            display: block;
            position: relative;
            overflow: visible;
            height: 0px;
          }

          .creator-hover-region {
            position: relative;
            overflow: visible;
            top: -10px;
            height: 60px;
            text-align: center;
          }

          .cell-creator {
            display: none;
            background: var(--theme-cell-creator-bg);
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
            pointer-events: all;
            position: relative;
            top: -5px;
          }

          .cell-creator button {
            display: inline-block;

            width: 22px;
            height: 20px;
            padding: 0px 4px;

            text-align: center;

            border: none;
            outline: none;
            background: none;
          }

          .cell-creator button span {
            font-size: 15px;
            line-height: 1;

            color: var(--theme-cell-creator-fg);
          }

          .cell-creator button span:hover {
            color: var(--theme-cell-creator-fg-hover);
          }

          .creator-hover-region:hover > .cell-creator {
            display: inline-block;
          }

          .octicon {
            transition: color 0.5s;
          }
        `}</style>
      </div>
    );
  }
}

class CellCreator extends React.Component<ConnectedProps> {
  createCell = (type: "code" | "markdown"): void => {
    const {
      above,
      createCellBelow,
      createCellAppend,
      createCellAbove,
      id,
      contentRef
    } = this.props;

    if (id == null || typeof id != "string") {
      createCellAppend({ cellType: type, contentRef });
      return;
    }

    above
      ? createCellAbove({ cellType: type, id, contentRef })
      : createCellBelow({ cellType: type, id, source: "", contentRef });
  };

  render() {
    return (
      <PureCellCreator above={this.props.above} createCell={this.createCell} />
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  createCellAppend: (payload: { cellType: CellType; contentRef: ContentRef }) =>
    dispatch(actions.createCellAppend(payload)),
  createCellAbove: (payload: {
    cellType: CellType;
    id?: string;
    contentRef: ContentRef;
  }) => dispatch(actions.createCellAbove(payload)),
  createCellBelow: (payload: {
    cellType: CellType;
    id?: string;
    source: string;
    contentRef: ContentRef;
  }) => dispatch(actions.createCellBelow(payload))
});

// $FlowFixMe: react-redux typings
export default connect(
  null,
  mapDispatchToProps
)(CellCreator);
