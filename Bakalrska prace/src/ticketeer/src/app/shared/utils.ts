/* xgajdo24
* utilitní funkce pro získání dat
*/
export class ObjectUtils {
    public static getData(object): object {
        const result = {};
        Object.keys(object).map(key => (result[key] = object[key]));
        return result;
    }

  public static createMap<V>(array: V[], propKey: keyof V, valueKey?: keyof V): Map<any, any> {
    const map: Map<any, any> = new Map<any, any>();
    array.forEach(item => map.set(item[propKey], valueKey ? item[valueKey] : item));
    return map;
  }
}

export class Utils {
    public static blobToFile = (theBlob: Blob, fileName: string): File => {
        const b: any = theBlob;
        b.lastModifiedDate = new Date();
        b.name = fileName;

        return theBlob as File;
    };
}
