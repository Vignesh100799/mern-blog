export const userCon = async (req, res) => {
    try {
        res.send({ message: "Route checking" })
    } catch (error) {
        console.log(error)
    }
}