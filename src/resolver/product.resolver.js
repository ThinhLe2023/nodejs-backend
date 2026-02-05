const productResolver = {
    Query: {
        product(_, { id }) {
            return { id: id, name: "Sample Product", price: 2.99 };
        }
    }
}
export default productResolver;