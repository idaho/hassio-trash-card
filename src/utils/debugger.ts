interface DebuggerData {
  message: string;
  data: any;
}

class Debugger {
  protected data: DebuggerData[] = [];

  public reset () {
    this.data = [];
  }

  public log (message: string, data: any) {
    this.data.push({
      message,
      data
    });
  }

  public getLogs () {
    return this.data;
  }
}

export {
  Debugger
};

export type {
  DebuggerData
};
