const orderResolver = {
    Query: {
        order: (_, { id }) => {
            return { id: id, name: "Sample Order", total: 123.39 };
        }
    }
}

export default orderResolver;