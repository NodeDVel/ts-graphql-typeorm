import { ErrorNames } from "@Lib/types";

interface IError {
    description: string;
    code: number;
    message: string;
}

const Errors: { [key in ErrorNames]: IError } = {
    Not_User: {
      description: '일치하는 유저가 없음',
      code: 412,
      message: '아이디, 비밀번호를 확인해주세요',
    },
    Not_Found: {
      description: '해당하는 데이터가 없음',
      code: 404,
      message: '존재하지 않는 페이지입니다.',
    },
    Database_Error: {
      description: '핸들링되지 않은 데이터베이스 오류',
      code: 520,
      message: '알 수 없는 데이터베이스 오류입니다. 관리자에게 문의해주세요.',
    },
    Wrong_Request: {
      description: '잘못된 접근이나 요청, 토큰',
      code: 401,
      message: '잘못된 요청입니다.',
    },
    Wrong_FileExtension: {
      description: '잘못된 파일 확장자',
      code: 412,
      message: '잘못된 파일 확장자입니다.',
    },
    Limit_File_Size: {
      description: '파일 사이즈 제한에 걸림',
      code: 412,
      message: '잘못된 파일 크기입니다.',
    },
    Wrong_Data: {
      description: '잘못된 요청 데이터',
      code: 412,
      message: '잘못된 요청 데이터입니다.',
    },
    Unhandled_Error: {
      description: '핸들링되지 않은 오류',
      code: 520,
      message: '알 수 없는 오류입니다. 관리자에게 문의해주세요.',
    },
    Exist_User: {
      description: '존재하는 유저',
      code: 412,
      message: '존재하는 유저입니다.',
    },
    Token_Expired: {
      description: '토큰 만료',
      code: 401,
      message: '토큰이 만료되었습니다.',
    },
    Forbidden: {
      description: '권한 거부',
      code: 403,
      message: '권한이 없습니다.',
    },
    Exist_Data: {
      description: '중복 요소',
      code: 412,
      message: '중복되는 데이터입니다.',
    },
    Not_Found_Board: {
      description: '존재하지 않는 게시글',
      code: 404,
      message: '해당 게시글이 존재하지 않습니다.',
    },
    Not_Found_Comment: {
      description: '존재하지 않는 댓글',
      code: 404,
      message: '해당 댓글이 존재하지 않습니다.',
    },
  };
  
export default Errors;