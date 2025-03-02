import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
import type { CustomLoadingOptions, RequestConfig, RequestConfigWithLoading } from '@/types/request'

class Request {
    private instance: AxiosInstance
    private loadingOptions: CustomLoadingOptions

    constructor(config: RequestConfig) {
        this.instance = axios.create(config)
        this.loadingOptions = {
            lock: true,
            text: '加载中...',
            background: 'rgba(0, 0, 0, 0.7)',
            ...config.loadingOptions
        }

        // 请求拦截器
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig & RequestConfigWithLoading) => {
                // 类型断言合并类型
                const mergedConfig = config as InternalAxiosRequestConfig & RequestConfigWithLoading

                // 携带 token
                if (mergedConfig.carryToken !== false) {
                    const token = localStorage.getItem('token')
                    if (token) {
                        mergedConfig.headers.Authorization = `Bearer ${token}`
                    }
                }

                // 处理 loading
                if (mergedConfig.showLoading) {
                    const loadingInstance = ElLoading.service({
                        ...this.loadingOptions,
                        ...mergedConfig.loadingOptions
                    })
                    mergedConfig._loading = {
                        close: loadingInstance.close
                    }
                }

                return mergedConfig
            },
            error => {
                return Promise.reject(error)
            }
        )

        // 响应拦截器
        this.instance.interceptors.response.use(
            response => {
                const config = response.config as RequestConfigWithLoading

                // 关闭 loading
                if (config.showLoading) {
                    config._loading?.close()
                }

                const { status } = response

                if (status === 200) {
                    return response.data
                } else {
                    this.handleError(status, '')
                    return Promise.reject(response)
                }
            },
            error => {
                const config = error.config as RequestConfigWithLoading | undefined

                // 关闭 loading
                if (config?.showLoading) {
                    config._loading?.close()
                }

                this.handleHttpError(error)
                return Promise.reject(error)
            }
        )
    }

    // 处理业务逻辑错误
    private handleError(code: number, message: string) {
        switch (code) {
            case 401:
                // token 失效处理
                localStorage.removeItem('token')
                // 跳转到登录页
                window.location.href = '/login'
                break
            case 403:
                // 权限不足处理
                break
            default:
                ElMessage({
                    message: `请求错误：${message}`,
                    type: 'error'
                })
            // 可以在这里触发全局错误提示
        }
    }

    // 处理 HTTP 错误
    private handleHttpError(error: any) {
        if (error.response) {
            // 请求已发出，服务器返回状态码非2xx
            const status = error.response.status
            switch (status) {
                case 400:
                    error.message = error.response.data?.error || '请求参数错误'
                    break
                case 404:
                    error.message = '请求资源不存在'
                    break
                case 500:
                    error.message = '服务器内部错误'
                    break
                default:
                    error.message = `连接错误 ${status}`
            }
        } else if (error.request) {
            // 请求已发出但没有收到响应
            error.message = '网络连接异常，请检查网络'
        } else {
            // 其他错误
            error.message = '请求处理异常'
        }
        // 可以在这里触发全局错误提示
    }

    // ... 保持原有的错误处理方法不变 ...

    // 更新请求方法类型定义
    request<T = any>(config: RequestConfig): Promise<T> {
        return this.instance.request(config)
    }

    get<T = any>(url: string, params?: any, config?: RequestConfig): Promise<T> {
        return this.instance.get<T, T>(url, { params, ...config })
    }

    post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
        return this.instance.post<T, T>(url, data, config)
    }

    put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
        return this.instance.put<T, T>(url, data, config)
    }

    delete<T = any>(url: string, params?: any, config?: RequestConfig): Promise<T> {
        return this.instance.delete<T, T>(url, { params, ...config })
    }

    upload<T = any>(url: string, file: File, config?: RequestConfig): Promise<T> {
        const formData = new FormData()
        formData.append('file', file)
        return this.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            ...config
        })
    }
}

// 创建实例
const request = new Request({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    // 默认 loading 配置
    loadingOptions: {
        text: '正在加载...',
        lock: true
    }
})

export const $http = request
export default request
