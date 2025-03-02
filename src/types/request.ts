import type { AxiosRequestConfig } from 'axios'
import type { LoadingOptions } from 'element-plus'

// 扩展 Element Plus 的 LoadingOptions 类型
export interface CustomLoadingOptions extends LoadingOptions {
    lock?: boolean
    text?: string
    background?: string
}

// 定义响应数据结构泛型
export interface ResponseData<T = any> {
    status: number
    code: number
    data: T
    message: string
}

// 扩展请求配置类型
export interface RequestConfig extends AxiosRequestConfig {
    /** 是否显示加载提示（默认false） */
    showLoading?: boolean
    /** 是否携带 token（默认true） */
    carryToken?: boolean
    /** 自定义 loading 配置 */
    loadingOptions?: CustomLoadingOptions
}

// 定义带 Loading 实例的请求配置
export interface RequestConfigWithLoading extends RequestConfig {
    _loading?: {
        close: () => void
    }
}
