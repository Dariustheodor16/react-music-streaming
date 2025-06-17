import styled from "styled-components";

const DataTable = ({ columns, data, renderRow, keyField }) => {
  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHeaderCell key={column.key}>{column.label}</TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            const rowData = renderRow(item);
            return (
              <TableRow key={item[keyField]}>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.key === "song" || column.key === "album" ? (
                      <SongInfo>
                        <SongImage
                          src={rowData[column.key].image}
                          alt={rowData[column.key].name}
                        />
                        <div>
                          <SongName onClick={rowData[column.key].onClick}>
                            {rowData[column.key].name}
                          </SongName>
                          <SongArtist>{rowData[column.key].artist}</SongArtist>
                        </div>
                      </SongInfo>
                    ) : (
                      rowData[column.key]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const TableContainer = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: rgba(255, 255, 255, 0.05);
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const TableHeaderCell = styled.th`
  padding: 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #d9d9d9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableCell = styled.td`
  padding: 16px;
  font-size: 14px;
  color: #fff;
  vertical-align: middle;
`;

const SongInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SongImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
`;

const SongName = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  margin-bottom: 4px;

  &:hover {
    color: #ff4343;
    text-decoration: underline;
  }
`;

const SongArtist = styled.div`
  font-size: 14px;
  color: #d9d9d9;
`;

export default DataTable;
