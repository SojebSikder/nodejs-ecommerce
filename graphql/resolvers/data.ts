const datas = [
  {
    title: "hello",
    text: "world",
  },
];

export const data = {
  datas: async () => {
    return datas;
  },

  createData: async (args) => {
    const data = {
      title: args.input.title,
      text: args.input.text,
    };
    datas.push(data);
    return data;
  },
};
