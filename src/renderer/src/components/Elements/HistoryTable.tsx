import {
  TableCellLayout,
  TableColumnDefinition,
  Title3,
  createTableColumn,
  makeStyles
} from '@fluentui/react-components'
import {
  DataGridBody,
  DataGrid,
  DataGridRow,
  DataGridHeader,
  DataGridCell,
  DataGridHeaderCell,
  RowRenderer
} from '@fluentui-contrib/react-data-grid-react-window'
import { DownloadHistory } from 'src/shared/types'
import { getDayjs } from '../../../../shared/util'

interface Props {
  list: DownloadHistory[]
  height: number
}

const useEmptyStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
function Empty(props: { height: number }) {
  const classes = useEmptyStyles()
  return (
    <div style={{ height: props.height }} className={classes.root}>
      <Title3>ダウンロードされた番組はありません</Title3>
    </div>
  )
}

export default function HistoryTable(props: Props) {
  const columns: TableColumnDefinition<DownloadHistory>[] = [
    createTableColumn<DownloadHistory>({
      columnId: 'path',
      renderHeaderCell: () => {
        return 'ダウンロード先'
      },
      renderCell: (history) => {
        return history.path
      }
    }),
    createTableColumn<DownloadHistory>({
      columnId: 'downloadDate',
      renderHeaderCell: () => {
        return 'ダウンロード日'
      },
      renderCell: (history) => {
        if (history.downloadDate != null) {
          const downloadDate = getDayjs(history.downloadDate, 'YYYYMMDDhhmmss')
          return <TableCellLayout>{downloadDate.format('YYYY/MM/DD hh:mm')}</TableCellLayout>
        }

        const progress = Math.floor(history.progress)
        return <TableCellLayout>ダウンロード中 {progress}%</TableCellLayout>
      }
    })
  ]

  const columnSizingOptions = {
    path: {
      idealWidth: 1000
    },
    downloadDate: {
      minWidth: 130
    }
  }

  const renderRow: RowRenderer<DownloadHistory> = ({ item, rowId }, style) => (
    <DataGridRow<DownloadHistory> key={rowId} style={style}>
      {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
    </DataGridRow>
  )

  const onSelectionChange = (e) => {
    console.debug(e)
  }

  return (
    <DataGrid
      onSelectionChange={onSelectionChange}
      items={props.list}
      columns={columns}
      resizableColumns
      columnSizingOptions={columnSizingOptions}
    >
      <DataGridHeader>
        <DataGridRow>
          {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
        </DataGridRow>
      </DataGridHeader>

      {/* DataGridHeader分の33pxを引く */}
      {props.list.length > 1 ? (
        <DataGridBody<DownloadHistory> itemSize={40} height={props.height - 33}>
          {renderRow}
        </DataGridBody>
      ) : (
        <Empty height={props.height - 33} />
      )}
    </DataGrid>
  )
}
