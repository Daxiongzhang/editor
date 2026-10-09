'use client'

import { Editor, ItemsPanel } from '@pascal-app/editor'
import { Hammer, Layers, Package, RectangleGoggles, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { BuildTab } from '@/components/build-tab'
import {
  CommunityViewerToolbarLeft,
  CommunityViewerToolbarRight,
} from '@/components/viewer-toolbar'
import {
  useWebXRInstalled,
  WebXRFeatureConsumer,
  WebXRFeatureRuntime,
} from '@/components/webxr-feature-gate'
import { useI18n } from '@/lib/i18n'

// The open-source editor only ships the built-in catalog (no uploaded items),
// so the Library/Community/Mine source chips and tag filters add nothing —
// drop them and keep the panel to plain categories.
function EditorItemsPanel() {
  return <ItemsPanel showSourceFilter={false} showTagFilters={false} />
}

const PROJECT_ID = 'local-editor'

export default function Home() {
  const webXRInstalled = useWebXRInstalled()
  const { t, translateDisplayText } = useI18n()
  const sidebarTabs = [
    {
      id: 'site',
      label: t('sidebar.scene'),
      component: () => null,
      mobileDefaultSnap: 0.5,
      mobileIcon: <Layers className="h-5 w-5" />,
      icon: (
        <Image
          alt=""
          className="h-8 w-8 object-contain"
          height={32}
          src="/icons/scene.webp"
          width={32}
        />
      ),
    },
    {
      id: 'build',
      label: t('sidebar.build'),
      component: BuildTab,
      mobileDefaultSnap: 0.5,
      mobileIcon: <Hammer className="h-5 w-5" />,
      icon: (
        <Image
          alt=""
          className="h-8 w-8 object-contain"
          height={32}
          src="/icons/build.webp"
          width={32}
        />
      ),
    },
    {
      id: 'items',
      label: t('sidebar.items'),
      component: EditorItemsPanel,
      mobileDefaultSnap: 0.5,
      mobileIcon: <Package className="h-5 w-5" />,
      icon: (
        <Image
          alt=""
          className="h-8 w-8 object-contain"
          height={32}
          src="/icons/couch.webp"
          width={32}
        />
      ),
    },
    {
      id: 'settings',
      label: t('sidebar.settings'),
      component: () => null,
      mobileDefaultSnap: 0.5,
      mobileIcon: <Settings className="h-5 w-5" />,
      icon: (
        <Image
          alt=""
          className="h-8 w-8 object-contain"
          height={32}
          src="/icons/settings.webp"
          width={32}
        />
      ),
    },
  ]
  return (
    <div className="relative h-screen w-screen">
      <WebXRFeatureRuntime enabled={webXRInstalled}>
        <WebXRFeatureConsumer>
          {(vr) => (
            <>
              {PROJECT_ID === 'local-editor' && (
                <div className="pointer-events-none absolute top-14 left-1/2 z-40 -translate-x-1/2">
                  <div className="pointer-events-none flex max-w-[min(92vw,42rem)] flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full border border-border/60 bg-background/90 px-4 py-1.5 text-xs shadow-sm backdrop-blur">
                    <span className="text-muted-foreground">{t('app.blankCanvas')}</span>
                    <Link
                      className="pointer-events-auto font-medium text-foreground hover:underline"
                      href="/scenes"
                    >
                      {t('app.openScenes')}
                    </Link>
                  </div>
                </div>
              )}
              <Editor
                immersive={vr?.session ? vr.immersive : undefined}
                layoutVersion="v2"
                projectId={PROJECT_ID}
                sidebarTabs={sidebarTabs}
                translateDisplayText={translateDisplayText}
                viewerToolbarLeft={<CommunityViewerToolbarLeft />}
                viewerToolbarRight={
                  <CommunityViewerToolbarRight
                    vrButton={
                      vr ? (
                        <button
                          aria-label={translateDisplayText(
                            vr.session ? 'Exit VR' : vr.entering ? 'Entering VR' : 'Enter VR',
                          )}
                          aria-pressed={Boolean(vr.session)}
                          className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:bg-accent disabled:opacity-50"
                          disabled={!vr.ready || vr.entering}
                          onClick={() => void (vr.session ? vr.exit() : vr.enter())}
                          title={translateDisplayText(
                            vr.error ??
                              (vr.ready ? (vr.session ? 'Exit VR' : 'Enter VR') : 'Preparing VR'),
                          )}
                          type="button"
                        >
                          <RectangleGoggles className="h-4 w-4" />
                        </button>
                      ) : null
                    }
                    vrLabel="Enter VR"
                  />
                }
              />
            </>
          )}
        </WebXRFeatureConsumer>
      </WebXRFeatureRuntime>
    </div>
  )
}
