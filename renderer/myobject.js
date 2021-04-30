class MyObject {
    static new(...args) {
        return new this(...args)
    }
}
