export class ResourceVersion {

    static initializationTime: number = Date.now();

    private constructor(
        private readonly time: number
    ) {
    }

    static new(): ResourceVersion {
        return new ResourceVersion(
            Date.now() - this.initializationTime
        );
    }

}
