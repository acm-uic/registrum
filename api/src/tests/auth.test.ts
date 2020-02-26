describe("Authentication Tests", () => {
    describe("Sanity Tests", () => {
        // ! xit indicates test case is pending and not written yet, remember to change to it
        // ! Google login strategy cannot be tested because it requires authentication from google side
        it("Logs user in correctly using email, password", () => {
            return
        })
        it("Logs user out correctly", () => {
            return
        })
        it("Cannot login with incorrect email", () => {
            return
        })
        it("Cannot login with incorrect password", () => {
            return
        })
    })

    describe("Edge Case tests", () => {
        it("Error with status code 401 when attempting to logout when not logged in", () => {
            return
        })
        it("Can't login when already logged in, error thrown", () => {
            return
        })
    })
})
