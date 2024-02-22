class Debugger {
  protected data: { message: string; data: any }[] = [];

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
