export class HttpCat {

    static URL_PREFIX: string = 'https://http.cat/';

    readonly url: string;

    constructor(
        readonly status: number,
    ) {
        this.url = HttpCat.URL_PREFIX + status;
    }

}
