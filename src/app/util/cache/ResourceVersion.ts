export class ResourceVersion {

    static initializationTime: number = Date.now();

    private constructor(
        private readonly time: number,
        private readonly cacheRef: unknown
    ) {
    }

    static new(cacheRef: unknown): ResourceVersion {
        return new ResourceVersion(
            Date.now() - this.initializationTime,
            cacheRef
        );
    }

}
