module.exports = async function (context, documents) {
  const updates = documents.map((stock) => ({
    target: "updated",
    arguments: [stock],
  }));

  context.bindings.signalrMessages = updates;
  context.done();
};
