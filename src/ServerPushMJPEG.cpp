/*
************************************************************************
** Copyright 2011 Samsung Techwin Co. Ltd. all right reserved.        **
**                                                                    **
** This software is the property of Samsung Techwin and is furnished  **
** under license by Samsung Techwin. This software may be used only   **
** in accordance with the terms of said license. This copyright notice**
** may not be removed, modified or obliterated without the prior      **
** written permission of Samsung Techwin.                             **
**                                                                    **
** This software may not be copied, transmitted, provided to or       **
** otherwise made available to any other person, company, corporation **
** or other entity except as specified in the terms of said  license. **
**                                                                    **
** No right, title, ownership or other interest in the software is    **
** hereby granted or transferred.                                     **
**                                                                    **
** The information contained herein is subject to change without      **
** notice and should not be construed as a commitment by              **
** Samsung Techwin.                                                   **
************************************************************************
************************************************************************
*/
/*
**********************************************************************
*@    Module name       : Server Push MJPEG application              *
*@    File name         : ServerPushMJPEG.cpp                        *
*@    Description       : Server Push MJPEG sample application       *
*@    Author Name       : Nagarajan Narayanan                        *
*@    Version           : 0.1 Date :30 Oct 2012                      *
*@    Reviewed by       :                                            *
*@                                                                   *
**********************************************************************
*/

#include <stdio.h>
#include <stdlib.h>
#include <SDKAPI/opensdk_defines.h>
#include <SDKAPI/opensdk_device.h>

#include "mjpegServer.h"

/**
*@ ********************************************************************
*@ Name           : recv_event                                        *
*@ Description    : Receives input event from camera SDK              *
*@ Arguments      : eventIn[IN]: Input event type                     *
*@                : pData[IN]  : Data for input event                 *
*@ Return Value   : N/A                                               *
*@ Notes          :                                                   *
*@ Change History :                                                   *
*@ ********************************************************************
**/
void recv_event(OPENSDK_INPUT_EVENT eventIn, void* pData)
{
    MJPEGSERVER*         pServer;
    
    //Get instance of MJPEGSERVER
    pServer  = MJPEGSERVER::get_instance();
    
    if(pServer == NULL) {
        OPENSDK::EVENT::send_event(OPENSDK_STOP_APPLICATION,NULL,NULL, 0);
        return;
    }

    //Handle the input events here
    switch(eventIn) {
        case OPENSDK_MEDIA_VIDEO:
        {
            OPENSDK_ENCVIDEO_EVENT* vidEvent;
            vidEvent = (OPENSDK_ENCVIDEO_EVENT*) pData;

            debug_message("Event Type: OPENSDK_MEDIA_VIDEO\n");
            //Process JPEG Image:
            pServer->process_jpeg_image(vidEvent->buff, vidEvent->size);
            break;
        }
        case OPENSDK_NEW_CLIENT:
        {
            OPENSDK_NETWORK_CLIENT* client;
            client = (OPENSDK_NETWORK_CLIENT*) pData;
            
            debug_message("Event Type: OPENSDK_NEW_CLIENT\n");
            //Process request from client
            pServer->manage_new_client(client->ip_address, client->port, client->client_id);
            break;
        }
        case OPENSDK_NETWORK_DATA:
        {
            OPENSDK_NETWORK_PACKET* pPacket;
            pPacket = (OPENSDK_NETWORK_PACKET*) pData;

            debug_message("Event Type: OPENSDK_NETWORK_DATA\n");
            //Process request from client
            pServer->process_request(pPacket);
            break;
        } 
        case OPENSDK_CLIENT_CLOSED:
        {
            int* client_id;
            client_id = (int*) pData;
            
            debug_message("Event Type: OPENSDK_CLIENT_CLOSED\n");
            //Process request from client
            pServer->close_client(*client_id);            
            break;
        }
        case OPENSDK_NETWORK_INTERFACE:
        {
            int* client_id;
            client_id = (int*) pData;

            debug_message("Event Type: OPENSDK_NETWORK_INTERFACE\n");
            break;
        }
        case OPENSDK_NETWORK_PORTS:
        {
            int* client_id;
            client_id = (int*) pData;

            debug_message("Event Type: OPENSDK_NETWORK_PORTS\n");
            break;
        }
        case OPENSDK_VIDEO_PROFILE:
        {
            int* client_id;
            client_id = (int*) pData;

            debug_message("Event Type: OPENSDK_VIDEO_PROFILE\n");
            break;
        }
        case OPENSDK_MEDIA_CONFIG:
        {
            int* client_id;
            client_id = (int*) pData;

            debug_message("Event Type: OPENSDK_MEDIA_CONFIG\n");
            break;
        }
        case OPENSDK_IMAGE_CONFIG:
        {
            int* client_id;
            client_id = (int*) pData;

            debug_message("Event Type: OPENSDK_IMAGE_CONFIG\n");
            break;
        }
        case OPENSDK_STORAGE:
        {
            int* client_id;
            client_id = (int*) pData;
            
            debug_message("Event Type: OPENSDK_STORAGE\n");
            break;
        }
        case OPENSDK_EVENT_CONFIG:
        {
            int* client_id;
            client_id = (int*) pData;

            debug_message("Event Type: OPENSDK_EVENT_CONFIG\n");
            break;
        }
        case OPENSDK_CPU_USAGE_HIGH:
        case OPENSDK_MEMORY_USAGE_HIGH:
        case OPENSDK_CPU_MEMORY_USAGE_HIGH:
        case OPENSDK_NETWORK_BANDWIDTH_HIGH:
        case OPENSDK_DISK_USAGE_HIGH:
		{
			printf("\nThe application is stopped due to  OPENSDK_DISK_USAGE_HIGH : %s\n",(char*)pData);
		}
        case OPENSDK_STOP_APP_CMD:
        {
            debug_message("Event: %d occurred. Stop application\n", eventIn);
            
            MJPEGSERVER::delete_instance();
            OPENSDK::EVENT::send_event(OPENSDK_STOP_APPLICATION, NULL, NULL,0);
            break;
        }
        case OPENSDK_NOTIFY:
        {
            char* msg;            
            msg = (char*) pData;
            debug_message("OPENSDK_NOTIFY message: %s\n", msg);
            break;
        }
        default:
        {
            debug_message("Unknown event %d occurred\n", eventIn);
            break;
        }
    }

    return;
}

/**
*@ ********************************************************************
*@ Name           : recv_data                                         *
*@ Description    : Receives data from camera SDK                     *
*@ Arguments      : payload_request[IN]: Request from web page        *
*@                : payload_response[OUT]  : Response to web page     *
*@ Return Value   : N/A                                               *
*@ Notes          :                                                   *
*@ Change History :                                                   *
*@ ********************************************************************
**/
OPENSDK_ERR_CODE recv_data(void *payload_request,
                           void *payload_response)
{
    OPENSDK_PAYLOAD_REQUEST*  req_payload;
    OPENSDK_PAYLOAD_RESPONSE* res_payload;
    OPENSDK_ERR_CODE          errCode;
    
    //Initialize local variable
    errCode = OPENSDK_APP_OK;
    
    //Get the request & response pointer
    req_payload = (OPENSDK_PAYLOAD_REQUEST*)payload_request;
    res_payload = (OPENSDK_PAYLOAD_RESPONSE*)payload_response;
    
    //Process request & send response
    
    return errCode;
}

/**
*@ ********************************************************************
*@ Name           : one_shot                                          *
*@ Description    : called to initialize application                  *
*@ Arguments      : N/A                                               *
*@ Return Value   : N/A                                               *
*@ Notes          :                                                   *
*@ Change History :                                                   *
*@ ********************************************************************
**/
void one_shot(void)
{
    MJPEGSERVER*           pServer;
    OPENSDK_NETWORK_CONFIG networkconfig;
    char*                  portNo;
    int                    len;
    bool                   flag;
    
    debug_message("one_shot\n");

    //Read camera model

    OPENSDK_SYS_INFO	 	*m_pSysInfo;
    OPENSDK_ERR_CODE          errCode;

	//Initialize local variable
	errCode = OPENSDK_APP_OK;

    m_pSysInfo = new OPENSDK_SYS_INFO();

    if(m_pSysInfo != NULL){
    	errCode = OPENSDK::DEVICE::opensdk_getSystemConfig(m_pSysInfo, sizeof(OPENSDK_SYS_INFO));
	}

    printf("\033[33merrCode %d\033[0m\n", errCode);
    printf("\033[33mmodel %s\033[0m\n", m_pSysInfo->devInfo.model);

    OPENSDK::SETTINGS::write_keyValue("model", m_pSysInfo->devInfo.model);
    
    //Start MJPEGSERVER

    //Initialize local variable
    flag    = false;
    portNo  = NULL;
    pServer = MJPEGSERVER::create_instance();
    portNo  = new char[MAX_PORT_NO_LEN];
    
    //Get port number from config file
    if(portNo && pServer) {    
        //Get the port value from config file
        len = OPENSDK::SETTINGS::read_keyValue("portNo", MAX_PORT_NO_LEN, portNo);
        
        if(len > MAX_PORT_NO_LEN) {
            //Setting value len greater than allocated memory
            //Reallocate memory
            delete[] portNo;
            portNo = new char[len];
            
            //Get the port value from config file
            if(portNo) {
                len = OPENSDK::SETTINGS::read_keyValue("portNo", len, portNo);
                flag = true;
            }
        } else {
            flag = true;
        }        
    } 

    //Start the server push mjpeg service
    if(flag == true) {
        networkconfig.socketType  = OPENSDK_TCP;
        networkconfig.serviceType = OPENSDK_SERVER;
        networkconfig.ipAddress   = NULL;
        networkconfig.portNo      = atoi(portNo);
        
        debug_message("portNo: %d\n", networkconfig.portNo);

            //Start network service
            OPENSDK::EVENT::send_event(OPENSDK_START_SERVICE,NULL, (void*)&networkconfig, sizeof(networkconfig));
    } else {
        debug_message("Error in starting application\n");        
        //Stop application
        OPENSDK::EVENT::send_event(OPENSDK_STOP_APPLICATION,NULL, NULL, 0);    
    }
    
    //Free the memory
    if(portNo) {
        delete[] portNo;
        portNo = NULL;
    }

    return;
}


