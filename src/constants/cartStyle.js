// for cart related styles
export default {
    titleContainer: {
        width: '100%',
        paddingVertical: 25,
        backgroundColor: '#091235', 
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        elevation: 3,
    },
    titleText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#F5E8C7', 
        textTransform: 'capitalize',
    },
    emptyCart: {
        flex: 1,
        backgroundColor: '#1A3D4F', 
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#F5E8C7', 
        paddingTop:300,
        justifyContent:'center',
    },
    totalRow: {
        flexDirection: 'row',
        backgroundColor: '#FFBF00', 
        paddingVertical: 15,
        width:'100%',
        alignItems:'flex-end',
        bottom:75,
        justifyContent:'space-evenly',

    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black', 
    },
    list: {
        width:'95%',
        flex:1,
        marginBottom:85,

    },
    listContentContainer: {
        alignItems:'center',

    },
    cartProductRow: {
        // flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom:20,
    },
    detailsQuantityColumn: {
        alignItems:'flex-start',
        width:280,
        paddingLeft:15,
    },
    productImage: {
        width: 120,
        height: 140,
        resizeMode: 'contain',
    },
    productDetails: {
        marginHorizontal:5,
        flex:1,
        alignItems:'stretch',

    },
    productTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'white', 
        textAlign:'justify',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',        
        color: 'white',
        marginBottom: 15, 
    },
    quantityAdjustRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        width:'70%',
        paddingBottom:10,
        paddingLeft:85,
    },
    removeButton: {
        justifyContent:'center',
        alignItems:'center',
        width:35,
        height:35,
        marginLeft:40,
    },
    quantityButton: {
        justifyContent:'center',
        alignItems:'center',
        width:35,
        height:35,
    },
    productQuantity: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 10,
        textAlign: 'center',
        color: 'white', 
    },
    checkoutButtonContainer: {
        bottom: 15,
        alignItems: 'center',
        justifyContent:'flex-end',
    },

}