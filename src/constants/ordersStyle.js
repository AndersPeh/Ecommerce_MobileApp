// for orders related styles
export default {
    titleContainer: {
        width: '100%',
        paddingVertical: 25,
        backgroundColor: '#091235', 
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },
    titleText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#F5E8C7', 
        textTransform: 'capitalize',
    },
    emptyOrders: {
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
    loadingContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#1A3D4F',
    },
    loadingText: {
        // marginTop: 10,
        fontSize: 16,
        color: '#F5E8C7',
    },
    mainScrollContainer: { 
        // flex: 1,
        width:'100%',
        height:'100%',
        // marginBottom:10,

    },
    categorySection: {
        // marginHorizontal: 6,
        marginBottom: 5,
    },
    categoryHeaderPressable: {
        backgroundColor: '#FFBF00', 
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
        marginHorizontal:8,
        marginTop:20,
    },
    categoryHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    orderItemContainer: { 
        // backgroundColor: 'white', 
        marginTop: 5,
        // borderRadius: 8,
        marginHorizontal:16,
        

    },
    orderCompactRowPressable: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: '#D1F6FF',
        marginTop:15,
        // borderRadius:8,
    },
    orderCompactText: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',

    },

    orderExpandedDetailsContainer: {
        padding: 10,
        backgroundColor: 'white', 
    },
    eachProductRow: { 
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 2,
    },
    productImage: { 
        width: 60,
        height: 60,
        resizeMode: 'contain',
        marginRight: 10,
        borderRadius: 4,
        backgroundColor: 'white',
    },
    eachProductDetailsColumn: { 
        flex: 1,
    },
    eachProductTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: 'black',
        marginBottom: 4,
    },
    eachProductPriceQuantityRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
    },
    eachProductPrice: {
        fontSize: 15,
        color: 'black',
    },
    eachProductQuantity: {
        fontSize: 15,
        color: 'black',
    },
    actionButtonContainer: {
        marginTop: 10,
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'center',
    },
    orderActionButton: { 
      marginHorizontal: 5, 
      height:40,
      width:120,
    },
    actionLoadingIndicator: {
        marginLeft: 10,
    },

}