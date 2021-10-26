import { Layout, PageHeader } from 'antd'
import { message, Upload, Button, Space } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { Descriptions, Badge } from 'antd'
import { useState } from 'react'
import Tabla from './Tabla'
import Thompson from './AFNs/Thompson'

type Description = {
  title: string
  description: string
}
interface RegsxToTableProps {}

const RegsxToTable: React.FC<RegsxToTableProps> = () => {
  const [expresion, setExpresion] = useState<string[] | null>(null)
  const [alfabeto, setAlfabeto] = useState<string[] | null>(null)

  const [Afd, setAfd] = useState<Thompson | null>(null)
  const [descripciones, setDescripciones] = useState<Description[]>([])

  const caracteresReservados: string[] = [
    '*',
    '?',
    '(',
    ')',
    '|',
    '+',
    '?',
    ' '
  ]
  const propsExpresion = {
    async onChange ({ file }: { file: any }) {
      try {
        const nuevaExpresion: string | null = await leerArchivo(file)
        if (nuevaExpresion) {
          const expresion = nuevaExpresion.trim().split('')
          if (validarExpresion(expresion)) {
            setExpresion(expresion)
          }
        }
      } catch (error:any) {
        message.error(error.message)
        return false
      }
    },
    beforeUpload: (file: any) => {
      return false
    },
    maxCount: 1,
    accept: '.txt'
  }
  const propsAlphabeth = {
    async onChange ({ file }: { file: any; fileList: any }) {
      console.log({ file })
      console.log(file.status)
      if (file.status !== 'removed') {
        try {
          const nuevoAlfabeto: string | null = await leerArchivo(file)
          if (nuevoAlfabeto) {
            const alfabeto = nuevoAlfabeto.trim().split('')
            if (validarAlfabeto(alfabeto)) {
              setAlfabeto(alfabeto)
            }
          }
        } catch (error:any) {
          message.error(error.message)
          return false
        }
      }
    },
    beforeUpload: (file: any) => {
      return false
    },
    maxCount: 1,
    accept: '.txt'
  }

  const validarAlfabeto = (entrada: string[]): boolean => {
    let isValid = true

    entrada.map((caracter: string) => {
      const esUnCaracterInvalido = caracteresReservados.includes(caracter)
      if (esUnCaracterInvalido) {
        isValid = false
        throw new Error('Su cadena incluye caracteres válidos')
      }
    })
    return isValid
  }

  const validarExpresion = (entrada: string[]): boolean => {
    let isValid = true
    entrada.map((caracter: string) => {
      const esUnCaracterInvalido =
        !alfabeto?.includes(caracter) &&
        !caracteresReservados.includes(caracter)
      if (esUnCaracterInvalido) {
        isValid = false
        throw new Error('Su expresion incluye caracteres válidos')
      }
    })
    return isValid
  }

  const leerArchivo = async (archivo: File): Promise<string | null> => {
    let informacionArchivo: string = ''
    if (!archivo) {
      message.error('Selecciona un archivo')
      return null
    }
    const lector = new FileReader()
    return new Promise((res, rej) => {
      lector.onload = function (e) {
        if (!lector.result) {
          message.error('Tu archivo está vacio')
          rej()
        } else {
          if (lector.result?.toString().length === 0) {
            message.error('Tu archivo está vacio')
            rej()
          }
          console.log(lector.result)
          informacionArchivo = lector.result as string
          res(informacionArchivo)
        }
      }
      lector.readAsText(archivo)
    })
  }
  const onProcesar = () => {
    try {
      if (alfabeto && expresion) {
        const AFND: Thompson = new Thompson({
          alfabeto,
          entrada: expresion
        })
        setDescripciones([
          ...descripciones,
          {
            title: 'afd procesado',
            description: AFND.fdaProcesado
          }
        ])
        setAfd(AFND)
      }
    } catch (error:any) {
      message.error(error.message)
    }
  }

  return (
    <>
      <div className='h-screen w-screen '>
        {/* <PageHeader
 className="fixed bottom-0 left-0 right-0"
backIcon={null}
    onBack={() => null}
    title="Expresión regular a tabla de transiciones"
  /> */}
        <div className=' h-full  flex'>
          <div className='h-full w-3-6  flex justify-center flex-col items-center'>
            <Space direction='vertical'>
              <Space>
                <Upload {...propsExpresion}>
                  <Button
                    disabled={alfabeto === null}
                    icon={<UploadOutlined />}
                  >
                    Sube tu expresión regular
                  </Button>
                </Upload>
                <Upload {...propsAlphabeth}>
                  <Button icon={<UploadOutlined />}>Sube tu alfabeto</Button>
                </Upload>
              </Space>
              <Descriptions column={1} bordered>
                <Descriptions.Item label='Expresión regular'>
                  {expresion}
                </Descriptions.Item>
                <Descriptions.Item label='Alfabeto'>
                  {alfabeto}
                </Descriptions.Item>
                {descripciones.map(descripcion => (
                  <Descriptions.Item label={descripcion.title}>
                    {descripcion.description}
                  </Descriptions.Item>
                ))}
              </Descriptions>
              <Button
                onClick={onProcesar}
                className='w-full'
                disabled={alfabeto === null}
              >
                Procesar cadena
              </Button>
            </Space>
          </div>
          <div className='h-full flex-col justify-center items-center w-3-6 flex  p-4'>
            {alfabeto && expresion && Afd && (
              <Tabla Afd={Afd} alfabeto={alfabeto} entrada={expresion} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default RegsxToTable