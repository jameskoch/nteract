import * as React from "react";
import { MediaBundle } from "@nteract/records";

/** Error handling types */
type ReactErrorInfo = {
  componentStack: string;
};

type Caught = {
  error: Error;
  info: ReactErrorInfo;
};

type RichMediaProps = {
  /**
   * Object of media type → data
   *
   * E.g.
   *
   * ```js
   * {
   *   "text/plain": "raw text",
   * }
   * ```
   *
   * See [Jupyter message spec](http://jupyter-client.readthedocs.io/en/stable/messaging.html#display-data)
   * for more detail.
   *
   */
  data: MediaBundle;
  /**
   * custom settings, typically keyed by media type
   */
  metadata: { [mediaType: string]: object };
  /**
   * React elements that accept mimebundle data, will get passed data[mimetype]
   */
  children: React.ReactNode;

  renderError(param: {
    error: Error;
    info: ReactErrorInfo;
    data: MediaBundle;
    metadata: object;
    children: React.ReactNode;
  }): React.ReactElement<any>;
};

/* We make the RichMedia component an error boundary in case of any <Media /> component erroring */
type State = {
  caughtError?: Caught | null;
};

const ErrorFallback = (caught: Caught) => (
  <div
    style={{
      backgroundColor: "ghostwhite",
      color: "black",
      fontWeight: 600,
      display: "block",
      padding: "10px",
      marginBottom: "20px"
    }}
  >
    <h3>{caught.error.toString()}</h3>
    <details>
      <summary>stack trace</summary>
      <pre>{caught.info.componentStack}</pre>
    </details>
  </div>
);

export class RichMedia extends React.Component<RichMediaProps, State> {
  static defaultProps: Partial<RichMediaProps> = {
    data: {},
    metadata: {},
    renderError: ErrorFallback
  };

  state: Partial<State> = {};

  componentDidCatch(error: Error, info: ReactErrorInfo) {
    this.setState({ caughtError: { error, info } });
  }

  render() {
    if (this.state.caughtError) {
      return this.props.renderError({
        ...this.state.caughtError,
        data: this.props.data,
        metadata: this.props.metadata,
        children: this.props.children
      });
    }

    // We must pick only one child to render
    let chosenOne: React.ReactChild | null = null;

    const data = this.props.data;

    // Find the first child element that matches something in this.props.data
    React.Children.forEach(this.props.children, child => {
      const childElement = child as React.ReactElement<any>;
      if (chosenOne) {
        // Already have a selection
        return;
      }
      if (
        childElement.props &&
        childElement.props.mediaType &&
        childElement.props.mediaType in data
      ) {
        chosenOne = childElement;
        return;
      }
    });

    // If we didn't find a match, render nothing
    if (chosenOne === null) {
      return null;
    }

    const mediaType = (chosenOne as React.ReactElement<any>).props.mediaType;

    return React.cloneElement(chosenOne, {
      data: this.props.data[mediaType],
      metadata: this.props.metadata[mediaType]
    });
  }
}
