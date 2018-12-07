#Auto generated, please dont edit. Editing might result in build failure or may render project unable to build.

SRC = src
SOURCES = $(shell find $(SRC) -name "*.cpp")
OPENSDK_ROOT = /opt/opensdk/

###################  DO NOT EDIT - BEGIN #########################
#version_begin  
VERSION = 3.00
#version_end

#include_begin
INCL = $(OPENSDK_ROOT)/opensdk-$(VERSION)/common/inc/ "/usr/include/i386-linux-gnu"  "/opt/opensdk/opensdk-3.00/common/inc"  "/usr/include"  "/home/andrew/workspace/ServerPushMJPEG/inc"  "/opt/opensdk/opensdk-3.00/wnSeriesArmCompiler/arm-linux-gnueabi/sysroot/usr/include/" 
#include_end

#pp1_begin
CXXFLAGS1 = -O2 -g -Wall -fmessage-length=0
#pp1_end

#pp2_begin
CXXFLAGS2 = -DWN -O2 -g -Wall -fmessage-length=0
#pp2_end

#pp3_begin
CXXFLAGS3 = -O2 -g -Wall
#pp3_end

#pp4_begin
CXXFLAGS4 = -DHI_3519 -O2 -g -Wall
#pp4_end

#pp5_begin
CXXFLAGS5 = -O2 -g -Wall -fmessage-length=0
#pp5_end

#lib1_begin
LIBS1 = -Llibs -lapphelper_wr
#lib1_end

#lib2_begin
LIBS2 = -Llibs -lapphelper_wn
#lib2_end

#lib3_begin
LIBS3 = -Llibs -lapphelper_hi_a
#lib3_end

#lib4_begin
LIBS4 = -Llibs -lapphelper_hi_3519
#lib4_end

#lib5_begin
LIBS5 = -Llibs -lapphelper_wn5
#lib5_end

###################  DO NOT EDIT - END  #########################

APP_HEADERS = $(shell find inc -name "*.h")
INC_APP = $(addprefix -I, $(sort $(dir $(APP_HEADERS))))
INC = $(addprefix -I, $(INCL))

PATH1 = $(OPENSDK_ROOT)/opensdk-$(VERSION)/linux_devkit/bin
CXX1 = $(PATH1)/arm-arago-linux-gnueabi-g++
TOOLS_PATH1 = $(PATH1)/../arm-arago-linux-gnueabi
INC1 = -I$(TOOLS_PATH1)/usr/include/
OBJS1 = $(patsubst $(SRC)%.cpp, $(SRC)%_wr.o, $(SOURCES))
APP_HELPER_PATH1 = $(TOOLS_PATH1)/usr/lib
TARGET1 = bin/ServerPushMJPEG_wr

PATH2 = $(OPENSDK_ROOT)/opensdk-$(VERSION)/wnSeriesArmCompiler/bin
CXX2 = $(PATH2)/arm-linux-gnueabi-g++
TOOLS_PATH2 = $(PATH2)/../arm-linux-gnueabi/sysroot
INC2 = -I$(TOOLS_PATH2)/usr/include/
OBJS2 = $(patsubst $(SRC)%.cpp, $(SRC)%_wn.o, $(SOURCES))
APP_HELPER_PATH2 = $(TOOLS_PATH2)/usr/lib
TARGET2 = bin/ServerPushMJPEG_wn

PATH3 = $(OPENSDK_ROOT)/opensdk-$(VERSION)/arm-hisiv400-linux/bin
CXX3 = $(PATH3)/arm-hisiv400-linux-gnueabi-g++
TOOLS_PATH3 = $(PATH3)/../target
INC3 = -I$(TOOLS_PATH3)/usr/include/
OBJS3 = $(patsubst $(SRC)%.cpp, $(SRC)%_hi_a.o, $(SOURCES))
APP_HELPER_PATH3 = $(TOOLS_PATH3)/usr/lib
TARGET3 = bin/ServerPushMJPEG_hi_a

PATH4 = $(OPENSDK_ROOT)/opensdk-$(VERSION)/arm-hisiv600-linux/bin
CXX4 = $(PATH4)/arm-hisiv600-linux-gnueabi-g++
TOOLS_PATH4 = $(PATH4)/../target
INC4 = -I$(TOOLS_PATH4)/usr/include/
OBJS4 = $(patsubst $(SRC)%.cpp, $(SRC)%_hi_3519.o, $(SOURCES))
APP_HELPER_PATH4 = $(TOOLS_PATH4)/usr/lib
TARGET4 = bin/ServerPushMJPEG_hi_3519

PATH5 = $(OPENSDK_ROOT)/opensdk-$(VERSION)/armv7-cortex_A7-linux-gnueabihf/bin
CXX5 = $(PATH5)/armv7-cortex_A7-linux-gnueabihf-g++
TOOLS_PATH5 = $(PATH5)/../armv7-cortex_A7-linux-gnueabihf/sysroot
INC5 = -I$(TOOLS_PATH5)/usr/include/
OBJS5 = $(patsubst $(SRC)%.cpp, $(SRC)%_wn5.o, $(SOURCES))
APP_HELPER_PATH5 = $(TOOLS_PATH5)/usr/lib
TARGET5 = bin/ServerPushMJPEG_wn5

all:  $(TARGET5) 

$(TARGET1): clean_bin $(OBJS1)
	$(CXX1) $(OPENSDK_ROOT)/opensdk-$(VERSION)/templates/libs/main_wr.o $(OBJS1) -o $@ -L$(APP_HELPER_PATH1) $(LIBS1)
#strip1_begin

	#strip1_end

src/%_wr.o: src/%.cpp
	@echo 'Building file: $<'
	@echo 'Invoking: Cross G++ Compiler'
	$(CXX1) $(CXXFLAGS1) -c -o '$@' '$<' $(INC1) $(INC) $(INC_APP)
	@echo 'Finished building: $<'
	@echo ' '

$(TARGET2): clean_bin $(OBJS2)
	$(CXX2) $(OPENSDK_ROOT)/opensdk-$(VERSION)/templates/libs/main_wn.o $(OBJS2) -o $@ -L$(APP_HELPER_PATH2) $(LIBS2)
#strip2_begin

	#strip2_end

src/%_wn.o: src/%.cpp
	@echo 'Building file: $<'
	@echo 'Invoking: Cross G++ Compiler'
	$(CXX2) $(CXXFLAGS2) -c -o '$@' '$<' $(INC2) $(INC) $(INC_APP)
	@echo 'Finished building: $<'
	@echo ' '

$(TARGET3): clean_bin $(OBJS3)
	$(CXX3) $(OPENSDK_ROOT)/opensdk-$(VERSION)/templates/libs/main_hi_a.o $(OBJS3) -o $@ -L$(APP_HELPER_PATH3) $(LIBS3)
#strip3_begin

	#strip3_end

src/%_hi_a.o: src/%.cpp
	@echo 'Building file: $<'
	@echo 'Invoking: Cross G++ Compiler'
	$(CXX3) $(CXXFLAGS3) -c -o '$@' '$<' $(INC3) $(INC) $(INC_APP)
	@echo 'Finished building: $<'
	@echo ' '
	
$(TARGET4): clean_bin $(OBJS4)
	$(CXX4) $(OPENSDK_ROOT)/opensdk-$(VERSION)/templates/libs/main_hi_3519.o $(OBJS4) -o $@ -L$(APP_HELPER_PATH4) $(LIBS4)
#strip4_begin

	#strip4_end

src/%_hi_3519.o: src/%.cpp
	@echo 'Building file: $<'
	@echo 'Invoking: Cross G++ Compiler'
	$(CXX4) $(CXXFLAGS4) -c -o '$@' '$<' $(INC4) $(INC) $(INC_APP)
	@echo 'Finished building: $<'
	@echo ' '

$(TARGET5): clean_bin $(OBJS5)
	$(CXX5) $(OPENSDK_ROOT)/opensdk-$(VERSION)/templates/libs/main_wn5.o $(OBJS5) -o $@ -L$(APP_HELPER_PATH5) $(LIBS5)
#strip5_begin

	#strip5_end

src/%_wn5.o: src/%.cpp
	@echo 'Building file: $<'
	@echo 'Invoking: Cross G++ Compiler'
	$(CXX5) $(CXXFLAGS5) -c -o '$@' '$<' $(INC5) $(INC) $(INC_APP)
	@echo 'Finished building: $<'
	@echo ' '

clean_bin:
	@rm -f bin/*

clean:
	rm -f bin/*  $(OBJS5) *.cap

