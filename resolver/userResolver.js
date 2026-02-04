const users = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" }
];

const userResolver = {
    Query: {
        getUser: (_, { id }) => {
            //return users.find(user => user.id === parseInt(id));
            return { id: id, name: "John Doe", email: "john@example.com" };
        }

    },

    Mutation: {
        createUser: (_, { name, email }) => {
            const newUser = { id: users.length + 1, name, email };
            users.push(newUser);
            return newUser;
        }
    }
};

export  {userResolver};