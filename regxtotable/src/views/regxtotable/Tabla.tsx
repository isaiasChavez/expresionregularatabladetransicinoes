import { Table, Tag, Space } from 'antd'
import { useEffect, useState } from 'react'
import Thompson, { FilaTabla } from './AFNs/Thompson'

interface TablaProps {
  entrada: string[]
  alfabeto: string[]
  Afd:Thompson
}

type ColumnType = {
  title: string
  dataIndex: string
  key: string
}

const Tabla: React.FC<TablaProps> = ({ alfabeto,Afd }) => {
  const [columns, setcolumns] = useState<ColumnType[]>([])
   const [rows, setRows] = useState([])

  useEffect(() => {
    console.log({ alfabeto })
    let newColumns: ColumnType[] = [
        {
          title: 'EDO',
          dataIndex: 'EDO',
          key: 'EDO'
        }
      ]
     let newRows:any = []

    alfabeto.map((letra: string, index: number) => {
      newColumns.push({
        title: letra.toUpperCase(),
        dataIndex: letra,
        key: letra
      })
    })
    newColumns.push({
     title: 'ε',
        dataIndex: 'ε' ,
        key: 'ε' 
    })
    Afd.filasTabla.map((fila:FilaTabla,index:number)=>{
        newRows.push({
         key:index,
         ...fila.getFila()
        })
    })
    console.log({newRows})
    setcolumns(newColumns)
    setRows(newRows)

  }, [])
 
  return (
    <>
      <Table className='w-full' bordered  columns={columns} dataSource={rows} />
    </>
  )
}

export default Tabla
