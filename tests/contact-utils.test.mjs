import assert from 'node:assert/strict'
import test from 'node:test'
import { formatBrazilianPhone, isSafeHttpUrl, normalizeBrazilianWhatsApp, whatsappUrl } from '../lib/contact-utils.mjs'

test('normaliza números brasileiros locais e internacionais', () => {
  assert.equal(normalizeBrazilianWhatsApp('(88) 99800-7589'), '5588998007589')
  assert.equal(normalizeBrazilianWhatsApp('+55 88 99800-7589'), '5588998007589')
  assert.equal(normalizeBrazilianWhatsApp('123'), null)
})

test('formata telefone e codifica a mensagem do WhatsApp', () => {
  assert.equal(formatBrazilianPhone('5588998007589'), '(88) 99800-7589')
  assert.equal(whatsappUrl('5588998007589', 'Olá!'), 'https://wa.me/5588998007589?text=Ol%C3%A1!')
})

test('aceita somente URLs HTTP ou HTTPS', () => {
  assert.equal(isSafeHttpUrl('https://instagram.com/wp'), true)
  assert.equal(isSafeHttpUrl('javascript:alert(1)'), false)
})
