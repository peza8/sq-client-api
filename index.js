console.log('Loading function 5');
exports.handler = async (event) => {
    console.log("Entered function");
    return {
        statusCode: 200,
        body: "All good"
    };
};
