type Handler = (event: any, context: any) => any;
export class ServelessFn {
  private functions = new Map<string, Handler>();
  register(name: string, fn: Handler) { this.functions.set(name, fn); }
  async invoke(name: string, event: any) {
    const fn = this.functions.get(name);
    if (!fn) throw new Error(`Function ${name} not found`);
    return fn(event, {});
  }
}
export default ServelessFn;
