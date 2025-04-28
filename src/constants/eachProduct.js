// To export StyleSheet to ProductList.
export default {
    price:{
        fontSize:14,
        fontWeight:"700",
        color:"black",
        fontFamily: "serif",
    },
    productTitle:{
        fontSize:14,
        fontWeight:"900",
        color:"black",
        fontFamily: "serif",
        marginBottom: 5,
    },
    image:{
        width:80,
        height:80,
        resizeMode: "contain",
        marginRight: 10,
    },
    listStyle: {
        width: '125%',
        marginBottom:85,

    },
    listContentContainer: {
        alignItems: 'center', 
    },
    product:
    {
        backgroundColor:"white",
        flexDirection: 'row',
        alignItems:"center",
        width:"70%",
        borderRadius:10,   
        marginBottom:15,
        elevation:3,
        padding:10,
    },
    productTextContainer: {
        flex: 1, 
        justifyContent: 'center', 
    },
    titleContainer: {
        width: '100%',
        paddingVertical: 25,
        backgroundColor: '#091235', 
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: 60,
        elevation: 3,
    },
    titleText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#F5E8C7', 
        textTransform: 'capitalize',
    },
    body:{
        width:"100%",
        flex:1,
        alignItems:"center",
        paddingBottom:100,  
    },
    container:{
        width:300,
        backgroundColor: "#D1F6FF",
        justifyContent:"center",
        alignItems:"center",
        borderRadius:5,   
        marginBottom:15,
        elevation:3,    
        paddingVertical:5,      
    },
}