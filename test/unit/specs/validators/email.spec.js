import email from 'src/validators/email'

describe('email validator', () => {
  it('should validate undefined', () => {
    expect(email(undefined)).to.be.true
  })

  it('should validate null', () => {
    expect(email(null)).to.be.true
  })

  it('should validate empty string', () => {
    expect(email('')).to.be.true
  })

  it('should not validate numbers', () => {
    expect(email('12345')).to.be.false
  })

  it('should not validate strings', () => {
    expect(email('asdf12345')).to.be.false
  })

  it('should not validate space', () => {
    expect(email(' ')).to.be.false
  })

  it('should not validate incomplete addresses', () => {
    expect(email('someone@')).to.be.false
    expect(email('someone@gmail')).to.be.false
    expect(email('someone@gmail.')).to.be.false
    expect(email('someone@gmail.c')).to.be.false
    expect(email('gmail.com')).to.be.false
    expect(email('@gmail.com')).to.be.false
  })

  it('should not validate addresses that contain unsupported characters', () => {
    expect(email('someone@g~mail.com')).to.be.false
    expect(email('someone@g=ail.com')).to.be.false
    expect(email('"someone@gmail.com')).to.be.false
  })

  it('should not validate addresses that contain spaces', () => {
    expect(email('someone@gmail.com ')).to.be.false
    expect(email('someone@gmail.com    ')).to.be.false
    expect(email(' someone@gmail.com')).to.be.false
  })

  it('should validate real addresses', () => {
    expect(email('someone@gmail.com')).to.be.true
    expect(email('someone@g-mail.com')).to.be.true
    expect(email('some!one@gmail.com')).to.be.true
    expect(email('soMe12_one@gmail.com')).to.be.true
    expect(email('someone@gmail.co')).to.be.true
    expect(email('someone@g.cn')).to.be.true
    expect(email('someone@g.accountants')).to.be.true
    expect(email('"some@one"@gmail.com')).to.be.true
    expect(email('"some one"@gmail.com')).to.be.true
  })
})
