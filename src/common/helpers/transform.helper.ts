export class TransformHelper {
  public static trim({ value }) {
    return value ? value.trim() : value;
  }

  public static toString({ value }) {
    return value ? value.toString() : value;
  }
}
