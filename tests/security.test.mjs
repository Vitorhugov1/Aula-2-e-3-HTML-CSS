import test from 'node:test'
import assert from 'node:assert/strict'
import { detectImageType, isSafeSocialUrl, isStrongAdminPassword } from '../lib/security.mjs'

test('detecta imagens pelo conteúdo, não pelo nome informado', () => {
  assert.deepEqual(detectImageType(new Uint8Array([0xff, 0xd8, 0xff, 0xe0])), { mime: 'image/jpeg', extension: 'jpg' })
  assert.deepEqual(detectImageType(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), { mime: 'image/png', extension: 'png' })
  assert.deepEqual(detectImageType(new TextEncoder().encode('RIFF1234WEBP')), { mime: 'image/webp', extension: 'webp' })
  assert.equal(detectImageType(new TextEncoder().encode('<script>alert(1)</script>')), null)
})

test('aceita somente perfis HTTPS nos domínios sociais oficiais', () => {
  assert.equal(isSafeSocialUrl('https://www.instagram.com/wagner_wpsolucoeseletricas/', 'instagram'), true)
  assert.equal(isSafeSocialUrl('http://instagram.com/wp', 'instagram'), false)
  assert.equal(isSafeSocialUrl('https://instagram.com.evil.example/wp', 'instagram'), false)
  assert.equal(isSafeSocialUrl('https://facebook.com/wp', 'facebook'), true)
  assert.equal(isSafeSocialUrl('https://user:pass@facebook.com/wp', 'facebook'), false)
})

test('exige senha administrativa forte', () => {
  assert.equal(isStrongAdminPassword('Fraca123!'), false)
  assert.equal(isStrongAdminPassword('SenhaSegura123!'), true)
  assert.equal(isStrongAdminPassword('senhasegura123!'), false)
})
