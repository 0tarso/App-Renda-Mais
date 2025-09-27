export const logGenerate = (archiveName: string, message: any[]) => {
  console.log("")
  console.log(`=========>>  Log em ${archiveName}  <<=========`)
  message.map(msg => {
    console.log(msg)
  })
}