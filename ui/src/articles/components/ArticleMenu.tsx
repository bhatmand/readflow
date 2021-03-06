import React from 'react'
import { useQuery } from 'react-apollo-hooks'

import DropdownMenu from '../../common/DropdownMenu'
import { matchResponse } from '../../common/helpers'
import Loader from '../../common/Loader'
import { GetArchiveServicesResponse } from '../../settings/archive-services/models'
import { GetArchiveServices } from '../../settings/archive-services/queries'
import { Article } from '../models'
import ArchiveLink from './ArchiveLink'
import OfflineLink from './OfflineLink'
import ShareLink from './ShareLink'

interface Props {
  article: Article
  noShortcuts?: boolean
}

type AllProps = Props

export default ({ article, noShortcuts = false }: AllProps) => {
  const nvg: any = window.navigator

  const { data, error, loading } = useQuery<GetArchiveServicesResponse>(GetArchiveServices)

  const renderArchiveServices = matchResponse<GetArchiveServicesResponse>({
    Loading: () => (
      <li>
        <Loader />
      </li>
    ),
    Error: err => <li>{err.message}</li>,
    Data: ({ archivers }) =>
      archivers.map(service => (
        <li key={`as-${service.id}`}>
          <ArchiveLink article={article} service={service} noShortcuts={noShortcuts} />
        </li>
      )),
    Other: () => <li>Unknown error</li>
  })

  return (
    <DropdownMenu>
      <ul>
        {nvg.share && (
          <li>
            <ShareLink article={article} />
          </li>
        )}
        {article.isOffline ? (
          <li>
            <OfflineLink article={article} remove noShortcuts={noShortcuts} />
          </li>
        ) : (
          <li>
            <OfflineLink article={article} noShortcuts={noShortcuts} />
          </li>
        )}
        {renderArchiveServices(data, error, loading)}
      </ul>
    </DropdownMenu>
  )
}
