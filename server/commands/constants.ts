export const getAllProductOption = `
select * from ProductOptions
`;

export const getSearchProductByName = `
select * from ProductOptions where name = ?
`;

// Create UUID
export const createUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

