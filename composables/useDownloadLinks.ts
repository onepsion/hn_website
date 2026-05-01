export type DownloadType = 'windows' | 'macos' | 'android' | 'ios'

type DownloadLinks = Record<DownloadType, string>

const DOWNLOAD_FILES: Record<DownloadType, string> = {
  windows: 'win',
  android: 'ad',
  macos: 'mac.zip',
  ios: 'ios',
}

const UNAVAILABLE_DOWNLOAD_TYPES: DownloadType[] = ['macos', 'ios']
const NEW_TAB_DOWNLOAD_TYPES: DownloadType[] = ['windows', 'android']
const DOWNLOAD_UNAVAILABLE_MESSAGE = '暂未开放'

const createDefaultLinks = (): DownloadLinks => ({
  windows: '',
  macos: '',
  android: '',
  ios: '',
})

const createStaticLinks = (): DownloadLinks => {
  const basePath = '/file'
  const baseUrl = process.client ? `${window.location.origin}${basePath}` : basePath

  return {
    windows: `${baseUrl}/${DOWNLOAD_FILES.windows}`,
    android: `${baseUrl}/${DOWNLOAD_FILES.android}`,
    macos: '',
    ios: '',
  }
}

export const useDownloadLinks = () => {
  const downloadLinks = useState<DownloadLinks>('download-links', createDefaultLinks)
  const linksLoaded = useState<boolean>('download-links-loaded', () => false)
  const loading = ref(false)
  const loadError = ref('')

  const firstAvailableType = computed<DownloadType | ''>(() => {
    const order: DownloadType[] = ['windows', 'macos', 'android', 'ios']
    return order.find((type) => Boolean(downloadLinks.value[type])) ?? ''
  })

  const firstAvailableLink = computed(() => {
    return firstAvailableType.value ? downloadLinks.value[firstAvailableType.value] : ''
  })

  const hasLink = (type: DownloadType) => Boolean(downloadLinks.value[type])

  const isDownloadAvailable = (type: DownloadType) => !UNAVAILABLE_DOWNLOAD_TYPES.includes(type)

  const shouldOpenInNewTab = (type: DownloadType) => NEW_TAB_DOWNLOAD_TYPES.includes(type)

  const getDownloadLink = (type?: DownloadType | '') => {
    return type ? downloadLinks.value[type] : ''
  }

  const detectPreferredType = (): DownloadType | '' => {
    if (!process.client) {
      return ''
    }

    const ua = navigator.userAgent

    if (/Android/i.test(ua)) {
      return 'android'
    }

    if (/iPhone|iPad|iPod/i.test(ua)) {
      return 'ios'
    }

    if (/Macintosh|Mac OS X/i.test(ua)) {
      return 'macos'
    }

    if (/Windows/i.test(ua)) {
      return 'windows'
    }

    return ''
  }

  const loadDownloadLinks = async (force = false) => {
    if ((linksLoaded.value && !force) || loading.value) {
      return downloadLinks.value
    }

    loading.value = true
    loadError.value = ''

    try {
      downloadLinks.value = createStaticLinks()
      linksLoaded.value = true
    } catch (error) {
      loadError.value = error instanceof Error ? error.message : '下载地址暂时不可用'
    } finally {
      loading.value = false
    }

    return downloadLinks.value
  }

  const openDownload = (type?: DownloadType | '') => {
    const resolvedType = type || firstAvailableType.value

    if (!process.client || !resolvedType) {
      return ''
    }

    const target = downloadLinks.value[resolvedType]

    if (!isDownloadAvailable(resolvedType) || !target) {
      window.alert(DOWNLOAD_UNAVAILABLE_MESSAGE)
      return ''
    }

    if (shouldOpenInNewTab(resolvedType)) {
      window.open(target, '_blank', 'noopener')
    } else {
      window.location.href = target
    }

    return target
  }

  return {
    downloadLinks,
    firstAvailableLink,
    firstAvailableType,
    getDownloadLink,
    hasLink,
    loadDownloadLinks,
    loadError,
    loading,
    detectPreferredType,
    openDownload,
  }
}
