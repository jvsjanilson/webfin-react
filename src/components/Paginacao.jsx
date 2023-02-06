import { Pagination } from 'react-bootstrap';

const Paginacao = ({evento, paginas }) => {
    const { meta, links, ...rest } = paginas;
    
    return (
        
        <Pagination >
            <Pagination.First onClick={evento.bind(this,1)}/>
            <Pagination.Prev disabled={ links?.prev == null ? true : false } 
                onClick={links?.prev == null ? null: evento.bind(this, links?.prev.split('?')[1].split('=')[1])}
            />
            
            {
            
                meta?.links?.map((item, index )=> {
                    
                    if (index > 0) {
                        if (item.url == null && item.label == '...')
                            return (<Pagination.Ellipsis disabled />)
                        else {
                            if (!isNaN(parseInt(item.label))) {

                                return <Pagination.Item 
                                            disabled={item.active ? true: false} 
                                            onClick={evento.bind(this, parseInt(item.label))}
                                        >{item.label}</Pagination.Item>
                            }
                        }
                    }

                })
            }
            <Pagination.Next disabled={ links?.next == null ? true : false }
                onClick={links?.next == null ? null : evento.bind(this, links?.next.split('?')[1].split('=')[1])}
            />
            <Pagination.Last onClick={evento.bind(this, meta?.last_page)}/>
        </Pagination> 
    )
}

export default Paginacao