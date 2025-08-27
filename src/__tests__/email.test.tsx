import EmailBuilder from "../email";

describe('email', () => {
    it('Should return true for valid email', () => {
        expect(EmailBuilder()).toMatchSnapshot()
    })
})
