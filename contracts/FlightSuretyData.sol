pragma solidity ^0.4.25;

import "../client/node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/
    


    address private contractOwner;                  // Account used to deploy contract
    bool private operational = true;                // Blocks all state changes throughout the contract if false
    mapping(address => uint256) private authorizedContracts;
  
    /********************************************************************************************/
    /* State variables for airline functions                                                  
    /*  Registration of fifth and subsequent airlines requires multi-party consensus of 50% 
    /* of registered airlines
    /********************************************************************************************/
    uint constant M = 4;
    uint private multiPartyConsensus = 4;   // multi-party consensus
    address[] multiCalls = new address[](0);

    struct Airline {
        address airline;
        string id;
        string name;
        string country;
        uint   funds; 
        bool isRegistered;
        bool isFunded;
    }

    mapping(address => Airline) airlines;      // Mapping for storing airlines

    /********************************************************************************************/
    /* State variables for flight functions                                                  
    /********************************************************************************************/
    struct Flight {
        bool isRegistered;
        uint8 statusCode;
        uint256 updatedTimestamp;        
        address airline;
    }
    mapping(string => Flight) private flights;

    /********************************************************************************************/
    /* State variables for Flight Insurance functions                                                  
    /********************************************************************************************/
    
    struct FlightInsurance {
        bytes32 insuranceKey;
        bool isPaid;
        bool isInsured;
        uint256 insurancePrice;  
        uint256 insurancePayout;  
    }

    mapping(bytes32 => FlightInsurance) private flightInsurances;


    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/


    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational() 
    {
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    /**
    * @dev Modifier that checks if caller is authorized
    */
    modifier isCallerAuthorized()
    {
        require(authorizedContracts[msg.sender] == 1, "Caller is not authorized");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */      
    function isOperational() external view returns(bool) 
    {
        return operational;
    }


    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */    
    function setOperatingStatus(bool mode) 
                            external
                            requireContractOwner 
    {
        operational = mode;
    }

    function authorizeCaller(address contractAddress)
                            external
                            requireContractOwner
    {
        authorizedContracts[contractAddress] = 1;
    }

    function deauthorizeCaller(address contractAddress)
                            external
                            requireContractOwner
    {
        delete authorizedContracts[contractAddress];
    }
    
    /********************************************************************************************/
    /*                                       Constructor                                        */
    /********************************************************************************************/

    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor(string id, string name, string country) public 
    {
        contractOwner = msg.sender;

        //  R1. First airline is registered when contract (FlightSuretyData) is deployed.
            airlines[contractOwner] = Airline(
                {
                    airline: contractOwner, 
                    id: id, 
                    name: name, 
                    country: country,
                    funds: 0,
                    isRegistered: true,
                    isFunded: false
                }); 

    }
    /********************************************************************************************/
    /*                                     AIRLINE SMART CONTRACT FUNCTIONS                      */
    /********************************************************************************************/
   /**
    * @dev Add an airline to the registration queue
    *       - R1. First airline is registered when contract (FlightSuretyData) is deployed.
    *       - R2. New Airline registration Can only be called from FlightSuretyApp contract
    *       - R3. Only existing airline may register a new airline 
    *            until there are at least four airlines registered
    *       - R4. Registration of fifth and subsequent airlines 
    *             requires multi-party consensus of 50% of registered airlines
    *       - R5. Airline can be registered, but does not participate in contract 
    *             until it submits funding of 10 ether
    */   
    function registerAirline(address sender,address newAirline, string id, string name, string country) 
            external
            requireIsOperational
            //isCallerAuthorized
            returns(bool success)
    {
        require(!airlines[newAirline].isRegistered, "Airline is already registered.");

        //  - R3. Only existing airline may register a new airline 
        //        until there are at least four airlines registered
        require(airlines[sender].isRegistered, "Caller is not registered as airline");


        // - R4. Registration of fifth and subsequent airlines 
        //       requires multi-party consensus of 50% of registered airlines
        multiCalls.push(msg.sender);

        // first 4 airline does not need multi party consense 
        if (multiCalls.length < M) {
        // Register now
            airlines[newAirline] = Airline(
                {
                    airline: newAirline, 
                    id: id, 
                    name: name, 
                    country: country,
                    funds: 0,
                    isRegistered: true,
                    isFunded: false
                });   
        } else {         // check multi party consense 
        // Register now
            airlines[newAirline] = Airline(
                {
                    airline: newAirline, 
                    id: id, 
                    name: name, 
                    country: country,
                    funds: 0,
                    isRegistered: true,
                    isFunded: false
                }); 
            multiCalls = new address[](0);  
        }

        return airlines[newAirline].isRegistered;
    }

    function isAirline(address airline) 
            external 
            returns(bool success)
    {
        return airlines[airline].isRegistered;
    }

    // function 'getAirlineData' that fetches the airline data
    function getAirlineData(address airline) 
        external 
        returns 
        (
        string id,
        string name,
        string country,
        uint   funds,
        bool isRegistered,
        bool isFunded
        ) 
    {
        require(airlines[airline].isRegistered, "Airline is not registered ");

        // return  attributes
        id = airlines[airline].id;
        name = airlines[airline].name;
        country = airlines[airline].country;
        funds = airlines[airline].funds;
        isRegistered = airlines[airline].isRegistered;
        isFunded = airlines[airline].isFunded;
    }
    /********************************************************************************************/
    /*                                     FLIGHT SMART CONTRACT FUNCTIONS                      */
    /********************************************************************************************/
   /**
    * @dev Register a future flight for insuring.
    *
    */  
    function registerFlight(string flightNumber, address airline)
                                external
                                requireIsOperational
                                isCallerAuthorized
                                returns(bool success)
    {
        require(airlines[airline].isRegistered, "Airline is not registered");
        
        require(!flights[flightNumber].isRegistered, "Flight is already registered.");

        flights[flightNumber] = Flight(
            {
            isRegistered: true,
            airline: airline,
            statusCode: 0,    // STATUS_CODE_UNKNOWN
            updatedTimestamp: block.timestamp 
            });
        return flights[flightNumber].isRegistered;
    }
    function updateFlightStatus( address airline, 
                                string  flightNumber, 
                                uint256 timestamp, 
                                uint8 statusCode )
                                external
                                requireIsOperational
                                isCallerAuthorized
    {
        require(airlines[airline].isRegistered, "Airline is not registered");
        
        require(flights[flightNumber].isRegistered, "Flight is not registered.");

        flights[flightNumber].statusCode = statusCode;
        flights[flightNumber].updatedTimestamp = timestamp;
    }
    /**
    * @dev Check if Flight is registered
    *
    * @return A bool that indicates if the flight is registered
    */   
    function isFlightRegistered(string flightNumber)
            external 
            returns(bool success)
    {
        return flights[flightNumber].isRegistered;
    }

    // function 'getFlightData' that fetches the flight data
    function getFlightData(string flightNumber) 
        external 
        returns 
        (
        bool isRegistered,
        uint8 statusCode,
        uint256 updatedTimestamp,        
        address airline
        ) 
    {
        require(flights[flightNumber].isRegistered, "Flight is not registered.");
        // return  attributes
        isRegistered = flights[flightNumber].isRegistered;
        statusCode = flights[flightNumber].statusCode;
        updatedTimestamp = flights[flightNumber].updatedTimestamp;
        airline = flights[flightNumber].airline;
    }

    /********************************************************************************************/
    /*                                     INSURANCE SMART CONTRACT FUNCTIONS                      */
    /********************************************************************************************/
   /**
    * @dev Passenger buy insurance for a flight
    */   
    function buy(
        bytes32 key,
        uint256 insurancePrice) 
        external payable
        requireIsOperational
        isCallerAuthorized
    {
        require(!flightInsurances[key].isInsured ,              "Passenger is already insured for that flight."); 
        require( (insurancePrice > 0 && insurancePrice <= 1) ,  "Insurance price is up to 1 ether"); 


        flightInsurances[key] = FlightInsurance(
                {
                insuranceKey: key,
                isPaid: false, 
                isInsured: true, 
                insurancePrice: insurancePrice,
                insurancePayout: 0
                });              
    }

    // function 'getInsuranceData' that fetches the insurance  data 
    function getInsuranceData(bytes32 key) 
        external 
        view
        returns 
        (
        bytes32 insuranceKey,
        bool isInsured,
        bool isPaid,
        uint256 insurancePrice,
        uint256 insurancePayout  
        ) 
    {
        require(flightInsurances[key].isInsured ,     "Passenger is not insured for that flight."); 

        // return  attributes
        insuranceKey = flightInsurances[key].insuranceKey;
        isInsured= flightInsurances[key].isInsured; 
        isPaid= flightInsurances[key].isPaid; 
        insurancePrice = flightInsurances[key].insurancePrice;
        insurancePayout = flightInsurances[key].insurancePayout;
    }

    /**
     *  @dev Credits payouts to insurees
    */
    function creditInsurees() external pure
    {
    }
    

    /**
     *  @dev Transfers eligible payout funds to insuree
     *
    */
    function pay()external pure
    {
    }

   /**
    * @dev Initial funding for the insurance. Unless there are too many delayed flights
    *      resulting in insurance payouts, the contract should be self-sustaining
    *
    */   
    function fund(address airline, uint256 value) 
            public payable
            requireIsOperational
            isCallerAuthorized
    {
        require(airlines[airline].isRegistered, "Airline is not registered");
        uint256 totalFunds = airlines[airline].funds.add(value);
        require(totalFunds > 0, "Funds overflow occoured");
        airlines[airline].funds = totalFunds; 
        if(totalFunds >= 10){
            airlines[airline].isFunded = true;
        } else{
            airlines[airline].isFunded = false;
        }
    }

    /**
    * @dev Fallback function for funding smart contract.
    *
    */
    function() external  payable 
    {
        //fund();
    }


}

