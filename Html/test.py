# coding=utf-8

import websockets
import asyncio
import json

SUCC_CODE = 1000
ILLEGAL_PARAM_CODE = 1001
SRV_BUSY_CODE = 1002
INNER_ERR_CODE = 1003
OTHER_ERR_CODE = 1004

AUDIO_DATA_HEADER = "|DAT|00|"
VIDEO_DATA_HEADER = "|DAT|01|"
JSON_DATA_HEADER = "|DAT|02|"
SELF_DATA_HEADER = "|DAT|03|"
SELF_DATA_END_HEADER = "|DAT|04|"

MSG_HEADER = "|MSG|00|"

OPEN_SESSION_HEADER = "|CTL|00|"
CLOSE_SESSION_HEADER = "|CTL|01|"
CHAT_HEADER = "|CTL|02|"

VOICE_START = "voice_start"
VOICE_END = "voice_end"

# APP ID:rsqstupyoihq1e0c;
# access token:PpDzRbtP8I12Q86NpjrWJ6vklr9aXQ2h;

# 使用说明：测试前需要在saas平台申请appid和token
uri = "wss://speech.bytedance.com/api/v1/virtual_human/tta/2d?appid=rsqstupyoihq1e0c&access_token=bearer%3BPpDzRbtP8I12Q86NpjrWJ6vklr9aXQ2h"
uid = "avatar_android"
codec = "mp4"
# 使用说明：测试前替换为具体使用的形象
role = "XiaoLan"
background = "https://lf3-speech.bytetos.com/obj/speech-tts-external/test_background.jpeg"
logo = {
    "logo_url": "https://lf3-speech.bytetos.com/obj/speech-tts-external/test_logo.png"
}

param = json.dumps(dict(uid=uid, role=role, codec=codec, logo=logo, background=background))


def parse_event(data):
    obj = json.loads(data)
    return obj["callback_info"]["type"]


async def generate_video(text):
    mp4_file = open("test.mp4", "wb")
    try:
        # 建立连接
        async with websockets.connect(uri) as ws:
            print(OPEN_SESSION_HEADER + param)
            # 开启session
            await ws.send(OPEN_SESSION_HEADER + param)
            data = await ws.recv()
            # 发送需要播报的文本
            await ws.send(CHAT_HEADER + text)
            while True:
                data = await ws.recv()
                header = data[0:8]
                # 事件相关回调
                if header == JSON_DATA_HEADER:
                    event = parse_event(data[8:])
                    # 开始播报的事件
                    if event == VOICE_START:
                        print("start to talk")
                    # 结束播报的事件
                    elif event == VOICE_END:
                        print("end to talk")
                        # 关闭session
                        await ws.send(CLOSE_SESSION_HEADER)
                # 控制指令相关回调
                elif header == MSG_HEADER:
                    ele = json.loads(data[8:])
                    print("get msg:{}".format(data[8:]))
                    if ele["code"] != 1000:
                        break
                # 二进制相关数据回调
                else:
                    # 获取mp4格式数据
                    if bytes.decode(header) == SELF_DATA_HEADER:
                        mp4_file.write(data[8:])
                    # 获取最后一包mp4数据
                    elif bytes.decode(header) == SELF_DATA_END_HEADER:
                        mp4_file.write(data[8:])
                        break
    except websockets.exceptions.ConnectionClosed:
        print("video produce succ")
    finally:
        mp4_file.close()


async def generate_stream(text):
    audio_file = open("test.pcm", "wb")
    video_file = open("test.h264", "wb")
    try:
        # 建立连接
        async with websockets.connect(uri, extra_headers=conn_header) as ws:
            # 开启session
            await ws.send(OPEN_SESSION_HEADER + param)
            data = await ws.recv()
            print(data)
            # 发送需要播报的文本
            await ws.send(CHAT_HEADER + text)
            while True:
                data = await ws.recv()
                header = data[0:8]
                # 事件相关回调
                if header == JSON_DATA_HEADER:
                    event = parse_event(data[8:])
                    # 开始播报的事件
                    if event == VOICE_START:
                        print("start to talk")
                    # 结束播报的事件
                    elif event == VOICE_END:
                        print("end to talk")
                        # 关闭session
                        await ws.send(CLOSE_SESSION_HEADER)
                        break
                # 控制指令相关回调
                elif header == MSG_HEADER:
                    ele = json.loads(data[8:])
                    print("get msg:{}".format(data[8:]))
                    if ele["code"] != 1000:
                        break
                # 二进制相关数据回调
                else:
                    # 获取pcm格式音频数据
                    if bytes.decode(header) == AUDIO_DATA_HEADER:
                        audio_file.write(data[8:])
                    # 获取h264格式视频数据
                    elif bytes.decode(header) == VIDEO_DATA_HEADER:
                        video_file.write(data[8:])
    except websockets.exceptions.ConnectionClosed:
        print("stream produce succ")
    finally:
        audio_file.close()
        video_file.close()


asyncio.get_event_loop().run_until_complete(generate_video("今天天气真不错"))