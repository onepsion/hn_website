// api/index.ts
import { Body } from '#components'
import { useApiFetch } from '~/utils/request'



/**
 * 登录
 * @param username 用户名
 * @param password 密码
 */
export function myInvitStatis() {
  return useApiFetch('/invit/statis/my',{
    method: 'get'
  }) as any
}

export function querySettings() {
  return useApiFetch('/app/settings/query',{
    method: 'get'
  }) as any
}


export function restMyLink() {
  return useApiFetch('/consumer/reset/mylink',{
    method: 'get'
  }) as any
}


export function planList() {
  return useApiFetch('/plan/query',{
    method: 'get'
  }) as any
}


export function submitOrder(order : any) {
  return useApiFetch('/order/submit',{
    method: 'post',
    body: order
  }) as any
}

export function queryOrder(orderNo : string) {
  return useApiFetch('/order/query/' + orderNo,{
    method: 'get'
  }) as any
}

/**
 * 注册
 * @param data { username, password, code }
 */
export const register = (data: { username: string; password: string; code: string }) => {
  return useApiFetch('/register', {
    method: 'POST',
    body: data
  })
}

/**
 * 发送验证码
 * @param phone 手机号
 */
export const goSendCode = (userName: string) => {
  return useApiFetch('/validcode/reg/send/' + userName, {
    method: 'GET'
  }) as any
}

/**
 * 获取个人信息
 */
export const getProfile = () => {
  return useApiFetch('/profile', {
    method: 'GET'
  })
}

export const getDurList = () => {
  return useApiFetch('/convert/query', {
    method: 'GET'
  }) as any
}

export const convertDur = (data : any) => {
  return useApiFetch('/order/convert/submit', {
    method: 'POST',
    body: data
  }) as any
}

export const listAppleAcc = (data : any) => {
  return useApiFetch('/apple/acc/list', {
    method: 'GET'
  }) as any
}

export const queryDeviceList = () => {
  return useApiFetch('/device/list', {
    method: 'GET'
  }) as any
}


