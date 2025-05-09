// for orders related styles
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
        marginTop: 10,
        fontSize: 16,
        color: '#F5E8C7',
    },
    mainScrollContainer: { 
        flex: 1,
    },
    categorySection: {
        marginHorizontal: 10,
        marginBottom: 15,
    },
    categoryHeaderPressable: {
        backgroundColor: '#365486', 
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 2,
        marginBottom: 5, 
    },
    categoryHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F5E8C7',
    },
    orderItemContainer: { 
        backgroundColor: 'white', 
        marginVertical: 5,
        borderRadius: 6,
        elevation: 1,
        overflow: 'hidden', 
    },
    orderCompactRowPressable: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        backgroundColor: '#7E8A97',
    },
    orderCompactText: {
        fontSize: 14,
        color: 'white',
    },
    orderCompactTextBold: {
        fontSize: 14,
        color: 'white',
        fontWeight: 'bold',
    },
    orderExpandedDetailsContainer: {
        padding: 10,
        backgroundColor: '#F0F0F0', 
    },
    eachProductRow: { 
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
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
        fontSize: 14,
        fontWeight: '600',
        color: 'black',
        marginBottom: 4,
    },
    eachProductPriceQuantityRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
    },
    eachProductPrice: {
        fontSize: 13,
        color: 'black',
    },
    eachProductQuantity: {
        fontSize: 13,
        color: 'black',
    },
    actionButtonContainer: {
        marginTop: 10,
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    orderActionButton: { 
      marginHorizontal: 5, 
      height:30,
    },
    actionLoadingIndicator: {
        marginLeft: 10,
    },

}